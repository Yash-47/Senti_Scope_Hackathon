import os
import sys
from dotenv import load_dotenv
from atproto import Client

def safe_print(*args, sep=" ", end="\n"):
    text = sep.join(str(arg) for arg in args)
    encoding = sys.stdout.encoding or "utf-8"
    encoded = text.encode(encoding, errors="replace")
    sys.stdout.buffer.write(encoded + end.encode(encoding))
    sys.stdout.flush()

def main():
    # Load environment variables from .env if present
    load_dotenv()

    handle = os.getenv("BSKY_HANDLE")
    password = os.getenv("BSKY_APP_PASSWORD")

    if not handle or not password:
        safe_print("Error: BSKY_HANDLE or BSKY_APP_PASSWORD environment variables are not set.")
        sys.exit(1)

    safe_print(f"Attempting login for handle: '{handle}'...")
    client = Client()

    try:
        profile = client.login(handle, password)
        safe_print("[SUCCESS] Login Successful")
        safe_print("Authenticated Account Details:")
        safe_print(f"DID: {profile.did}")
        safe_print(f"Handle: {profile.handle}")
    except Exception as e:
        safe_print("[FAILURE] Login Failed")
        safe_print("Full SDK Exception Trace:")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
