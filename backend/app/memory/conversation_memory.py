from typing import List, Dict, Any, Optional
from datetime import datetime
from backend.app.models.schemas import ChatMessage

class SessionMemory:
    def __init__(self, session_id: str, user_id: str = "USR-7729"):
        self.session_id = session_id
        self.user_id = user_id
        self.messages: List[ChatMessage] = []
        self.user_financial_context: Dict[str, Any] = {
            "focused_category": None,
            "savings_target_discussed": False,
            "last_action_suggested": None,
            "queries_count": 0,
            "sentiment": "neutral",
            "active_alert_ids": []
        }
        self.created_at = datetime.utcnow().isoformat()
        self.updated_at = datetime.utcnow().isoformat()

    def add_message(self, role: str, content: str):
        msg = ChatMessage(role=role, content=content)
        self.messages.append(msg)
        self.updated_at = datetime.utcnow().isoformat()
        if role == "user":
            self.user_financial_context["queries_count"] += 1
            self._update_context_from_message(content)

    def _update_context_from_message(self, text: str):
        lowered = text.lower()
        if "food" in lowered or "dining" in lowered or "swiggy" in lowered or "zomato" in lowered:
            self.user_financial_context["focused_category"] = "Food & Dining"
        elif "shop" in lowered or "amazon" in lowered or "myntra" in lowered:
            self.user_financial_context["focused_category"] = "Shopping"
        elif "travel" in lowered or "uber" in lowered or "commute" in lowered:
            self.user_financial_context["focused_category"] = "Travel & Commute"
        elif "entertainment" in lowered or "netflix" in lowered:
            self.user_financial_context["focused_category"] = "Entertainment"
            
        if "save" in lowered or "saving" in lowered or "budget" in lowered or "cut" in lowered:
            self.user_financial_context["savings_target_discussed"] = True

    def get_recent_messages(self, limit: int = 6) -> List[ChatMessage]:
        return self.messages[-limit:]

    def get_context_summary(self) -> str:
        ctx = self.user_financial_context
        lines = [
            f"User Session: {self.session_id}",
            f"Interactions Count: {ctx['queries_count']}",
            f"Current Focus Category: {ctx['focused_category'] or 'General Spending'}",
            f"Savings Target Discussed: {ctx['savings_target_discussed']}"
        ]
        if self.messages:
            lines.append("Recent Conversation:")
            for m in self.messages[-3:]:
                lines.append(f"  {m.role.upper()}: {m.content}")
        return "\n".join(lines)

class MemoryManager:
    _instances: Dict[str, SessionMemory] = {}

    @classmethod
    def get_session(cls, session_id: str, user_id: str = "USR-7729") -> SessionMemory:
        if session_id not in cls._instances:
            cls._instances[session_id] = SessionMemory(session_id=session_id, user_id=user_id)
        return cls._instances[session_id]

    @classmethod
    def reset_session(cls, session_id: str):
        if session_id in cls._instances:
            del cls._instances[session_id]
