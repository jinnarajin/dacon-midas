from pathlib import Path


class RuleDocumentLoader:
    """Load markdown rule documents from the skills directory."""

    def __init__(self, skills_dir: Path | None = None) -> None:
        project_root = Path(__file__).resolve().parents[4]
        self.skills_dir = skills_dir or project_root / "skills"

    def load(self, filename: str) -> str:
        path = self.skills_dir / filename
        return path.read_text(encoding="utf-8")

    def load_all(self) -> dict[str, str]:
        return {
            path.name: path.read_text(encoding="utf-8")
            for path in sorted(self.skills_dir.glob("*.md"))
        }
