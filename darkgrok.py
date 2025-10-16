import os
import json
from typing import List, Dict

import requests
import streamlit as st

# Safe example Streamlit client for local testing only. Not used by the web UI.

API_URL = "https://api.x.ai/v1/chat/completions"
API_KEY = os.environ.get("XAI_API_KEY", "")
MODEL = os.environ.get("XAI_MODEL", "grok-3")

SYSTEM_PROMPT = os.environ.get(
    "SYSTEM_PROMPT",
    "You are a helpful assistant. Provide concise, accurate answers and refuse "
    "requests that are illegal, unsafe, or unethical. Use Markdown for code."
)


def call_xai_api(messages: List[Dict[str, str]]) -> str:
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {API_KEY}"}
    payload = {"messages": messages, "model": MODEL, "stream": False, "temperature": 0.3}
    resp = requests.post(API_URL, headers=headers, data=json.dumps(payload))
    if resp.ok:
        return resp.json().get("choices", [{}])[0].get("message", {}).get("content", "")
    return f"API error: {resp.status_code} — {resp.text[:300]}"


def main() -> None:
    st.set_page_config(page_title="FutuChat (local)", page_icon="◈", layout="wide")
    st.title("FutuChat — local test client")
    st.write("This page uses your XAI_API_KEY from env. Do not commit secrets.")

    if "messages" not in st.session_state:
        st.session_state.messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for m in st.session_state.messages[1:]:
        with st.chat_message(m["role"]):
            st.markdown(m["content"])

    if prompt := st.chat_input("Ask something…"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        with st.chat_message("assistant"):
            with st.spinner("Thinking…"):
                reply = call_xai_api(st.session_state.messages)
                st.markdown(reply)
                st.session_state.messages.append({"role": "assistant", "content": reply})


if __name__ == "__main__":
    main()
