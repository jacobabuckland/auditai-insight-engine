# filepath: backend-app/tests/test_service_auth.py
import pytest
from fastapi import HTTPException
from app.core import service_auth


def test_missing_header():
    with pytest.raises(HTTPException) as exc:
        service_auth.require_service(None)
    assert exc.value.status_code == 401


def test_env_missing(monkeypatch):
    monkeypatch.delenv("SERVICE_BEARER", raising=False)
    with pytest.raises(HTTPException) as exc:
        service_auth.require_service("Bearer token")
    assert exc.value.status_code == 500


def test_invalid_token(monkeypatch):
    monkeypatch.setenv("SERVICE_BEARER", "expected")
    with pytest.raises(HTTPException) as exc:
        service_auth.require_service("Bearer wrong")
    assert exc.value.status_code == 403


def test_bad_scheme(monkeypatch):
    monkeypatch.setenv("SERVICE_BEARER", "expected")
    with pytest.raises(HTTPException) as exc:
        service_auth.require_service("Token expected")
    assert exc.value.status_code == 403


def test_success(monkeypatch):
    monkeypatch.setenv("SERVICE_BEARER", "secret")
    assert service_auth.require_service("Bearer secret") is True
