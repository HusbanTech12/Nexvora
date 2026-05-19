import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestHealthEndpoint:
    def test_health_check(self):
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestContactEndpoint:
    def test_submit_contact_missing_fields(self):
        response = client.post("/api/contact", json={})
        assert response.status_code == 422

    def test_submit_contact_invalid_email(self):
        response = client.post(
            "/api/contact",
            json={"name": "Test", "email": "invalid", "message": "Hello"},
        )
        assert response.status_code == 422


class TestConsultationEndpoint:
    def test_submit_consultation_missing_fields(self):
        response = client.post("/api/consultation", json={})
        assert response.status_code == 422


class TestLeadsEndpoint:
    def test_get_leads(self):
        response = client.get("/api/leads")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_leads_stats(self):
        response = client.get("/api/leads/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "new" in data
        assert "contacted" in data


class TestAnalyticsEndpoint:
    def test_get_analytics_summary(self):
        response = client.get("/api/analytics/summary")
        assert response.status_code == 200
        data = response.json()
        assert "total_leads" in data
        assert "page_views" in data

    def test_track_event(self):
        response = client.post(
            "/api/analytics/track",
            json={"event_type": "page_view", "event_data": "{}"},
        )
        assert response.status_code == 200
        assert response.json()["success"] is True


class TestChatEndpoint:
    def test_get_chat_history_empty(self):
        response = client.get("/api/chats/test-session-123")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
