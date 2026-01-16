"""
Dataset registry and configuration
All datasets are defined here as a whitelist for security
"""

DATASETS_REGISTRY = {
    "orders": {
        "label": "Orders (Fact)",
        "table": "project.dataset.fact_orders",
        "dimensions": {
            "dt": "DATE(order_ts)",
            "platform": "platform",
            "product_name": "product_name",
        },
        "measures": {
            "revenue": "SUM(revenue)",
            "orders": "COUNT(1)",
        },
    },
    "livestream": {
        "label": "Livestream (Fact)",
        "table": "project.dataset.fact_livestream",
        "dimensions": {
            "dt": "DATE(live_date)",
            "host": "host",
            "platform": "platform",
        },
        "measures": {
            "revenue": "SUM(revenue)",
            "sessions": "COUNT(1)",
        },
    },
}
