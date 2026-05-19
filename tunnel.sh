#!/bin/bash

SESSION="dashboard"
DIR="/Users/rizkirachman/IdeaProjects/goods-price-comparison-dashboard"

# Check dependencies
if ! command -v ngrok &> /dev/null; then
  echo "ngrok not found. Install it: brew install ngrok"
  exit 1
fi

if ! command -v tmux &> /dev/null; then
  echo "tmux not found. Install it: brew install tmux"
  exit 1
fi

# Kill existing session if running
tmux kill-session -t $SESSION 2>/dev/null

# Create new tmux session with 2 panes
tmux new-session -d -s $SESSION -n main

# Pane 1 — Vite
tmux send-keys -t $SESSION "cd $DIR && npm run dev" Enter

# Split horizontally, Pane 2 — ngrok
tmux split-window -h -t $SESSION
tmux send-keys -t $SESSION "sleep 3 && ngrok http 5173 --host-header='localhost:5173'" Enter

# Wait for ngrok to start then print URL
sleep 6
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)

echo ""
echo "Dashboard : http://localhost:5173"
echo "Public URL: $PUBLIC_URL"
echo "ngrok UI  : http://localhost:4040"
echo ""
echo "Session is running in background (tmux session: $SESSION)"
echo ""
echo "Reattach : tmux attach -t $SESSION"
echo "Stop     : tmux kill-session -t $SESSION"
