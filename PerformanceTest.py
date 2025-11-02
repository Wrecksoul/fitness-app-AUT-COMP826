import subprocess
import time
import statistics
import shlex
from pathlib import Path

# ====== Configuration ======
CURL_FILE = "curl3.txt"   # file containing a single curl command
REQUEST_COUNT = 120               # number of repetitions
INTERVAL = 0.5                   # seconds between requests
# ===========================


def run_curl(cmd):
    """Run curl command and return total time in seconds."""
    timed_cmd = cmd + ["-o", "/dev/null", "-s", "-w", "%{time_total}"]
    result = subprocess.run(timed_cmd, capture_output=True, text=True)
    try:
        return float(result.stdout.strip())
    except ValueError:
        return None


def percentile(data, percent):
    """Calculate percentile value such as TP90 or TP99."""
    if not data:
        return None
    data_sorted = sorted(data)
    k = (len(data_sorted) - 1) * (percent / 100)
    f = int(k)
    c = min(f + 1, len(data_sorted) - 1)
    if f == c:
        return data_sorted[int(k)]
    d0 = data_sorted[f] * (c - k)
    d1 = data_sorted[c] * (k - f)
    return d0 + d1


def main():
    file_path = Path(CURL_FILE)
    if not file_path.exists():
        print(f"Error: {CURL_FILE} not found.")
        return

    # Read the single curl command
    line = file_path.read_text().strip()
    if not line or line.startswith("#"):
        print("No valid curl command found in file.")
        return

    cmd = shlex.split(line)
    print(f"Testing command:\n{' '.join(cmd)}")
    print(f"\nRunning {REQUEST_COUNT} times with {INTERVAL}s interval...\n")

    times = []
    for i in range(REQUEST_COUNT):
        duration = run_curl(cmd)
        if duration is not None:
            times.append(duration)
            print(f"Run {i+1:02d}: {duration:.3f} sec")
        else:
            print(f"Run {i+1:02d}: failed")
        time.sleep(INTERVAL)

    if times:
        avg = statistics.mean(times)
        tp90 = percentile(times, 90)
        tp99 = percentile(times, 99)
        print("\n=== Summary ===")
        print(f"Total requests : {len(times)}")
        print(f"Average (avg)  : {avg:.3f} sec")
        print(f"TP90 (90th pct): {tp90:.3f} sec")
        print(f"TP99 (99th pct): {tp99:.3f} sec")
        
    else:
        print("No valid results recorded.")


if __name__ == "__main__":
    main()