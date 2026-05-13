import json
from dataclasses import dataclass
from typing import Any, Callable
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen as _urlopen

from backend.app.core.config import KISSettings, get_kis_settings


class KISClientError(RuntimeError):
    pass


@dataclass(frozen=True)
class KISQuote:
    current_price: int
    previous_close: int
    change: int
    change_rate: float
    volume: int
    trading_value: int
    market_cap: int | None = None


UrlOpen = Callable[[Request, float], Any]


class KISClient:
    """Minimal Korea Investment OpenAPI client for domestic stock quotes."""

    def __init__(
        self,
        settings: KISSettings | None = None,
        opener: UrlOpen | None = None,
        timeout: float = 5.0,
    ) -> None:
        self.settings = settings or get_kis_settings()
        self.opener = opener or _default_urlopen
        self.timeout = timeout
        self._access_token = self.settings.token

    @property
    def is_configured(self) -> bool:
        return self.settings.is_configured

    def get_current_price(self, stock_code: str) -> KISQuote:
        payload = self._request(
            "GET",
            "/uapi/domestic-stock/v1/quotations/inquire-price",
            tr_id="FHKST01010100",
            params={
                "FID_COND_MRKT_DIV_CODE": self.settings.market_division_code,
                "FID_INPUT_ISCD": stock_code,
            },
        )
        output = payload.get("output") or {}
        return KISQuote(
            current_price=_to_int(output.get("stck_prpr")),
            previous_close=_to_int(output.get("stck_sdpr")),
            change=_to_int(output.get("prdy_vrss")),
            change_rate=_to_float(output.get("prdy_ctrt")),
            volume=_to_int(output.get("acml_vol")),
            trading_value=_to_int(output.get("acml_tr_pbmn")),
            market_cap=_to_optional_int(output.get("hts_avls")),
        )

    def issue_access_token(self) -> str:
        if not self.settings.app_key or not self.settings.app_secret:
            raise KISClientError("KIS_APP_KEY and KIS_APP_SECRET are required to issue a token.")

        payload = self._send_json(
            "POST",
            "/oauth2/tokenP",
            headers={"Content-Type": "application/json"},
            body={
                "grant_type": "client_credentials",
                "appkey": self.settings.app_key,
                "appsecret": self.settings.app_secret,
            },
        )
        token = payload.get("access_token")
        if not isinstance(token, str) or not token:
            raise KISClientError("KIS token response did not include access_token.")
        self._access_token = token
        return token

    def _request(
        self,
        method: str,
        path: str,
        tr_id: str,
        params: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        if not self.is_configured:
            raise KISClientError("KIS credentials are not configured.")

        token = self._access_token or self.issue_access_token()
        headers = {
            "Content-Type": "application/json",
            "authorization": f"Bearer {token}",
            "appkey": self.settings.app_key or "",
            "appsecret": self.settings.app_secret or "",
            "tr_id": tr_id,
        }
        payload = self._send_json(method, path, headers=headers, params=params)

        if payload.get("msg_cd") == "EGW00123" and self.settings.app_key and self.settings.app_secret:
            self.issue_access_token()
            return self._request(method, path, tr_id, params)

        if payload.get("rt_cd") not in (None, "0"):
            message = payload.get("msg1") or payload.get("msg_cd") or "KIS API request failed."
            raise KISClientError(str(message))
        return payload

    def _send_json(
        self,
        method: str,
        path: str,
        headers: dict[str, str],
        body: dict[str, Any] | None = None,
        params: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        query = f"?{urlencode(params)}" if params else ""
        data = json.dumps(body).encode("utf-8") if body is not None else None
        request = Request(
            f"{self.settings.base_url}{path}{query}",
            data=data,
            headers=headers,
            method=method,
        )
        try:
            with self.opener(request, self.timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")
            raise KISClientError(f"KIS HTTP {error.code}: {detail}") from error
        except (URLError, TimeoutError) as error:
            raise KISClientError(f"KIS request failed: {error}") from error
        except json.JSONDecodeError as error:
            raise KISClientError("KIS response was not valid JSON.") from error


def _to_int(value: Any) -> int:
    if value in (None, ""):
        return 0
    return int(float(str(value).replace(",", "")))


def _to_optional_int(value: Any) -> int | None:
    if value in (None, ""):
        return None
    return _to_int(value)


def _to_float(value: Any) -> float:
    if value in (None, ""):
        return 0.0
    return float(str(value).replace(",", ""))


def _default_urlopen(request: Request, timeout: float) -> Any:
    return _urlopen(request, timeout=timeout)
