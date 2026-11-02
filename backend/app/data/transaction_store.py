from typing import List, Dict, Any
from backend.app.models.schemas import Transaction, UserProfile

# Default Profile
DEFAULT_USER = UserProfile(
    user_id="USR-7729",
    name="Aarav Sharma",
    account_number="HDFC0001928374",
    currency="₹",
    monthly_income=85000.0,
    savings_goal=25000.0,
    current_savings=18500.0,
    budgets={
        "Food & Dining": 10000.0,
        "Shopping": 7000.0,
        "Travel & Commute": 4000.0,
        "Entertainment": 3000.0,
        "Bills & Utilities": 6000.0,
        "Groceries": 8000.0,
        "Healthcare": 2500.0,
    }
)

# Realistic Multi-Month Banking Transactions
# Month: Current (October 2026) & Previous (September 2026)
TRANSACTIONS_DB: List[Transaction] = [
    # --- Current Month (October 2026) ---
    # Income
    Transaction(id="TXN-201", date="2026-10-01", description="Salary Credit - Infosys Corp", amount=85000.0, type="CREDIT", category="Income", payment_method="NEFT"),
    
    # Food & Dining: Total = ₹12,000 (Matches prompt exactly!)
    Transaction(id="TXN-202", date="2026-10-02", description="Swiggy Food Delivery - Gourmet Biryani", amount=850.0, type="DEBIT", category="Food & Dining", payment_method="UPI"),
    Transaction(id="TXN-203", date="2026-10-04", description="Zomato Restaurant - Mainland China", amount=2450.0, type="DEBIT", category="Food & Dining", payment_method="Credit Card"),
    Transaction(id="TXN-204", date="2026-10-07", description="Starbucks Coffee Koramangala", amount=780.0, type="DEBIT", category="Food & Dining", payment_method="UPI"),
    Transaction(id="TXN-205", date="2026-10-10", description="Swiggy Instamart Snacks & Dinner", amount=1220.0, type="DEBIT", category="Food & Dining", payment_method="UPI"),
    Transaction(id="TXN-206", date="2026-10-14", description="Bikanervala Sweets & Lunch", amount=650.0, type="DEBIT", category="Food & Dining", payment_method="UPI"),
    Transaction(id="TXN-207", date="2026-10-18", description="Toit Brewpub Weekend Social", amount=3350.0, type="DEBIT", category="Food & Dining", payment_method="Credit Card"),
    Transaction(id="TXN-208", date="2026-10-22", description="Zomato Late Night Order", amount=950.0, type="DEBIT", category="Food & Dining", payment_method="UPI"),
    Transaction(id="TXN-209", date="2026-10-27", description="Cafe Coffee Day Office Meet", amount=450.0, type="DEBIT", category="Food & Dining", payment_method="Debit Card"),
    Transaction(id="TXN-210", date="2026-10-29", description="Swiggy Dinner Bowls", amount=1300.0, type="DEBIT", category="Food & Dining", payment_method="UPI"),
    # Sum Food & Dining = 850 + 2450 + 780 + 1220 + 650 + 3350 + 950 + 450 + 1300 = 12000.0

    # Shopping: Total = ₹8,000 (Matches prompt exactly!)
    Transaction(id="TXN-211", date="2026-10-05", description="Amazon India - Electronics & Accessories", amount=3800.0, type="DEBIT", category="Shopping", payment_method="Credit Card"),
    Transaction(id="TXN-212", date="2026-10-12", description="Myntra Festive Sale - Apparel", amount=2700.0, type="DEBIT", category="Shopping", payment_method="UPI"),
    Transaction(id="TXN-213", date="2026-10-25", description="Zara Retail Store - Indiranagar", amount=1500.0, type="DEBIT", category="Shopping", payment_method="Credit Card"),
    # Sum Shopping = 3800 + 2700 + 1500 = 8000.0

    # Travel & Commute: Total = ₹3,500 (Matches prompt exactly!)
    Transaction(id="TXN-214", date="2026-10-03", description="Uber India Daily Commute", amount=620.0, type="DEBIT", category="Travel & Commute", payment_method="UPI"),
    Transaction(id="TXN-215", date="2026-10-08", description="Namma Metro Smart Card Recharge", amount=500.0, type="DEBIT", category="Travel & Commute", payment_method="UPI"),
    Transaction(id="TXN-216", date="2026-10-15", description="Uber Premier Airport Ride", amount=1480.0, type="DEBIT", category="Travel & Commute", payment_method="Credit Card"),
    Transaction(id="TXN-217", date="2026-10-21", description="Ola Cabs Office Commute", amount=550.0, type="DEBIT", category="Travel & Commute", payment_method="UPI"),
    Transaction(id="TXN-218", date="2026-10-28", description="HP Petrol Pump Fuel Refill", amount=350.0, type="DEBIT", category="Travel & Commute", payment_method="Debit Card"),
    # Sum Travel & Commute = 620 + 500 + 1480 + 550 + 350 = 3500.0

    # Entertainment: Total = ₹2,850 (Nearing ₹3,000 budget limit - 95%!)
    Transaction(id="TXN-219", date="2026-10-06", description="Netflix Premium India Subscription", amount=649.0, type="DEBIT", category="Entertainment", payment_method="Auto Debit"),
    Transaction(id="TXN-220", date="2026-10-11", description="PVR IMAX Cinema - Movie Tickets", amount=1400.0, type="DEBIT", category="Entertainment", payment_method="Credit Card"),
    Transaction(id="TXN-221", date="2026-10-19", description="Spotify Duo Music Subscription", amount=149.0, type="DEBIT", category="Entertainment", payment_method="Auto Debit"),
    Transaction(id="TXN-222", date="2026-10-24", description="SonyLIV Sports Annual Subscription", amount=652.0, type="DEBIT", category="Entertainment", payment_method="UPI"),
    # Sum Entertainment = 649 + 1400 + 149 + 652 = 2850.0

    # Bills & Utilities: Total = ₹5,400
    Transaction(id="TXN-223", date="2026-10-03", description="BESCOM Electricity Utility Bill", amount=2850.0, type="DEBIT", category="Bills & Utilities", payment_method="Net Banking"),
    Transaction(id="TXN-224", date="2026-10-05", description="Airtel Fiber Broadband Bill", amount=1179.0, type="DEBIT", category="Bills & Utilities", payment_method="Auto Debit"),
    Transaction(id="TXN-225", date="2026-10-09", description="BWSSB Water Supply Bill", amount=571.0, type="DEBIT", category="Bills & Utilities", payment_method="UPI"),
    Transaction(id="TXN-226", date="2026-10-12", description="Indane Gas LPG Cylinder Refill", amount=800.0, type="DEBIT", category="Bills & Utilities", payment_method="UPI"),
    # Sum Bills = 5400.0

    # Groceries: Total = ₹7,600
    Transaction(id="TXN-227", date="2026-10-02", description="Nature's Basket Organic Groceries", amount=3400.0, type="DEBIT", category="Groceries", payment_method="Credit Card"),
    Transaction(id="TXN-228", date="2026-10-16", description="Blinkit Weekly Grocery essentials", amount=2200.0, type="DEBIT", category="Groceries", payment_method="UPI"),
    Transaction(id="TXN-229", date="2026-10-26", description="BigBasket Monthly Staples Refill", amount=2000.0, type="DEBIT", category="Groceries", payment_method="UPI"),
    # Sum Groceries = 7600.0

    # Healthcare: Total = ₹1,200
    Transaction(id="TXN-230", date="2026-10-17", description="Apollo Pharmacy Health & Vitamins", amount=1200.0, type="DEBIT", category="Healthcare", payment_method="UPI"),


    # --- Previous Month (September 2026) for trend analysis ---
    # Food was ₹9,600 (Current ₹12,000 is exactly +25% higher! 12000 - 9600 = 2400 = 25%)
    Transaction(id="TXN-101", date="2026-09-01", description="Salary Credit - Infosys Corp", amount=85000.0, type="CREDIT", category="Income", payment_method="NEFT"),
    Transaction(id="TXN-102", date="2026-09-04", description="Swiggy Food Delivery", amount=3100.0, type="DEBIT", category="Food & Dining", payment_method="UPI"),
    Transaction(id="TXN-103", date="2026-09-12", description="Zomato Restaurant Dining", amount=3800.0, type="DEBIT", category="Food & Dining", payment_method="Credit Card"),
    Transaction(id="TXN-104", date="2026-09-22", description="Office Cafeteria & Snacks", amount=2700.0, type="DEBIT", category="Food & Dining", payment_method="UPI"),
    # Food Sep = 9600.0

    # Shopping Sep = ₹6,800
    Transaction(id="TXN-105", date="2026-09-10", description="Amazon India Autumn Sale", amount=4300.0, type="DEBIT", category="Shopping", payment_method="Credit Card"),
    Transaction(id="TXN-106", date="2026-09-20", description="Myntra Clothing", amount=2500.0, type="DEBIT", category="Shopping", payment_method="UPI"),

    # Travel & Commute Sep = ₹3,200
    Transaction(id="TXN-107", date="2026-09-08", description="Uber Daily Commute", amount=1800.0, type="DEBIT", category="Travel & Commute", payment_method="UPI"),
    Transaction(id="TXN-108", date="2026-09-18", description="Metro & Auto Rides", amount=1400.0, type="DEBIT", category="Travel & Commute", payment_method="UPI"),

    # Entertainment Sep = ₹2,100
    Transaction(id="TXN-109", date="2026-09-06", description="Netflix & Spotify Subscriptions", amount=800.0, type="DEBIT", category="Entertainment", payment_method="Auto Debit"),
    Transaction(id="TXN-110", date="2026-09-19", description="Cinema & Bowling", amount=1300.0, type="DEBIT", category="Entertainment", payment_method="Debit Card"),

    # Bills Sep = ₹5,200
    Transaction(id="TXN-111", date="2026-09-05", description="BESCOM & Airtel Utility", amount=5200.0, type="DEBIT", category="Bills & Utilities", payment_method="Net Banking"),

    # Groceries Sep = ₹7,400
    Transaction(id="TXN-112", date="2026-09-03", description="BigBasket Grocery Cart", amount=7400.0, type="DEBIT", category="Groceries", payment_method="UPI"),
]

class TransactionRepository:
    def __init__(self):
        self.transactions = list(TRANSACTIONS_DB)
        self.user = DEFAULT_USER

    def get_all(self, month: str = None) -> List[Transaction]:
        if not month:
            return self.transactions
        return [t for t in self.transactions if t.date.startswith(month)]

    def get_current_month_transactions(self) -> List[Transaction]:
        return self.get_all(month="2026-10")

    def get_previous_month_transactions(self) -> List[Transaction]:
        return self.get_all(month="2026-09")

    def get_user_profile(self) -> UserProfile:
        return self.user

    def add_transaction(self, txn: Transaction):
        self.transactions.append(txn)
