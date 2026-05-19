import pytest
from unittest.mock import patch
from app.services.ai_service import AIService


def extract_lead_info(response_text: str):
    """Standalone version for testing without LLM client dependencies."""
    import json
    try:
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
            data = json.loads(json_str)
            if data.get("lead_qualified"):
                return data
    except (json.JSONDecodeError, IndexError):
        pass
    return None


class TestLeadExtraction:
    def test_extract_lead_info_with_json_block(self):
        response = """I'd be happy to help with your project!

```json
{"lead_qualified": true, "name": "John Doe", "email": "john@example.com", "company": "Acme Corp", "budget": "$2000"}
```"""

        result = extract_lead_info(response)
        assert result is not None
        assert result["lead_qualified"] is True
        assert result["name"] == "John Doe"
        assert result["email"] == "john@example.com"

    def test_extract_lead_info_without_json_block(self):
        response = "I'd be happy to help you with your project. Would you like to book a consultation?"

        result = extract_lead_info(response)
        assert result is None

    def test_extract_lead_info_malformed_json(self):
        response = """Here's the info:
```json
{invalid json}
```"""

        result = extract_lead_info(response)
        assert result is None

    def test_extract_lead_info_not_qualified(self):
        response = """```json
{"lead_qualified": false, "name": "Jane"}
```"""

        result = extract_lead_info(response)
        assert result is None

    def test_extract_lead_info_minimal_fields(self):
        response = """Thanks for the info!
```json
{"lead_qualified": true, "name": "Test User", "email": "test@test.com"}
```"""

        result = extract_lead_info(response)
        assert result is not None
        assert result["name"] == "Test User"
        assert result["email"] == "test@test.com"
