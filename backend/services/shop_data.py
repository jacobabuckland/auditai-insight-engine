import sqlite3

def get_access_token(shop_domain: str) -> str:
    conn = sqlite3.connect("audit-ai/db/dev.db")  # Adjust path as needed
    cursor = conn.cursor()

    cursor.execute("SELECT accessToken FROM Shop WHERE shopDomain = ?", (shop_domain,))
    result = cursor.fetchone()

    conn.close()

    if result:
        return result[0]
    else:
        raise ValueError(f"No access token found for {shop_domain}")
