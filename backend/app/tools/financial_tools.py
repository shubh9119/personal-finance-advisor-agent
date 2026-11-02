from typing import List, Dict, Any, Optional
from backend.app.data.transaction_store import TransactionRepository, Transaction
from backend.app.models.schemas import ToolCallRecord
import math

repo = TransactionRepository()

def fetch_transactions(month: Optional[str] = "2026-10", category: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Fetches raw transaction list for a specified month and optional category filter.
    """
    txns = repo.get_all(month=month)
    if category:
        txns = [t for t in txns if t.category.lower() == category.lower()]
    return [t.model_dump() for t in txns]

def calculate_category_breakdown(month: str = "2026-10") -> Dict[str, Any]:
    """
    Aggregates total debit spending by category for the specified month.
    """
    txns = repo.get_all(month=month)
    breakdown = {}
    total_spend = 0.0
    total_income = 0.0

    for t in txns:
        if t.type == "CREDIT":
            total_income += t.amount
        else:
            breakdown[t.category] = breakdown.get(t.category, 0.0) + t.amount
            total_spend += t.amount

    category_pct = {k: round((v / total_spend) * 100, 2) if total_spend > 0 else 0.0 for k, v in breakdown.items()}

    return {
        "month": month,
        "total_spend": round(total_spend, 2),
        "total_income": round(total_income, 2),
        "category_totals": breakdown,
        "category_percentages": category_pct
    }

def compute_month_over_month_variance(curr_month: str = "2026-10", prev_month: str = "2026-09") -> Dict[str, Any]:
    """
    Computes month-over-month differences and percentage changes for all debit spending categories.
    """
    curr = calculate_category_breakdown(curr_month)["category_totals"]
    prev = calculate_category_breakdown(prev_month)["category_totals"]

    all_cats = set(curr.keys()).union(set(prev.keys()))
    comparison = {}

    for cat in all_cats:
        c_val = curr.get(cat, 0.0)
        p_val = prev.get(cat, 0.0)
        diff = round(c_val - p_val, 2)
        pct_change = round(((c_val - p_val) / p_val * 100), 2) if p_val > 0 else 100.0 if c_val > 0 else 0.0
        comparison[cat] = {
            "current_month": c_val,
            "previous_month": p_val,
            "difference": diff,
            "percentage_change": pct_change,
            "trend": "INCREASED" if diff > 0 else "DECREASED" if diff < 0 else "STABLE"
        }

    return {
        "current_month": curr_month,
        "previous_month": prev_month,
        "comparison": comparison
    }

def detect_unusual_spending_spikes(month: str = "2026-10", single_txn_threshold: float = 2000.0) -> List[Dict[str, Any]]:
    """
    Identifies high-value transactions or unusual spending spikes within a given month.
    """
    txns = repo.get_all(month=month)
    spikes = []
    for t in txns:
        if t.type == "DEBIT" and t.amount >= single_txn_threshold:
            spikes.append({
                "transaction_id": t.id,
                "description": t.description,
                "amount": t.amount,
                "category": t.category,
                "date": t.date,
                "reason": f"Single transaction exceeded threshold of ₹{single_txn_threshold:,.2f}"
            })
    return sorted(spikes, key=lambda x: x["amount"], reverse=True)

def evaluate_budget_thresholds(month: str = "2026-10") -> List[Dict[str, Any]]:
    """
    Compares current actual spend against assigned monthly budgets and identifies breaches/warnings.
    """
    user = repo.get_user_profile()
    curr_breakdown = calculate_category_breakdown(month)["category_totals"]
    evaluations = []

    for cat, limit in user.budgets.items():
        actual = curr_breakdown.get(cat, 0.0)
        usage_pct = round((actual / limit) * 100, 2) if limit > 0 else 0.0
        remaining = round(limit - actual, 2)

        status = "NORMAL"
        if actual > limit:
            status = "EXCEEDED"
        elif usage_pct >= 85.0:
            status = "NEAR_LIMIT"

        evaluations.append({
            "category": cat,
            "budget_limit": limit,
            "actual_spend": actual,
            "usage_pct": usage_pct,
            "remaining": remaining,
            "status": status
        })

    return evaluations

def calculate_savings_potential(category: str, reduction_pct: float = 15.0, month: str = "2026-10") -> Dict[str, Any]:
    """
    Calculates monthly and annualized savings impact if expenses in a category are reduced by a percentage.
    """
    curr_breakdown = calculate_category_breakdown(month)["category_totals"]
    actual = curr_breakdown.get(category, 0.0)
    monthly_savings = round((actual * reduction_pct / 100.0), 2)
    annual_savings = round(monthly_savings * 12.0, 2)

    return {
        "category": category,
        "current_spend": actual,
        "reduction_pct": reduction_pct,
        "estimated_monthly_savings": monthly_savings,
        "estimated_annual_savings": annual_savings,
        "projected_monthly_spend": round(actual - monthly_savings, 2)
    }

def get_top_spending_merchants(month: str = "2026-10", top_n: int = 5) -> List[Dict[str, Any]]:
    """
    Aggregates debit spend by merchant/description to identify top expense drivers.
    """
    txns = repo.get_all(month=month)
    merchant_spend = {}
    for t in txns:
        if t.type == "DEBIT":
            merchant_spend[t.description] = merchant_spend.get(t.description, 0.0) + t.amount

    sorted_merchants = sorted(merchant_spend.items(), key=lambda x: x[1], reverse=True)[:top_n]
    return [{"merchant": name, "total_spend": round(amt, 2)} for name, amt in sorted_merchants]
