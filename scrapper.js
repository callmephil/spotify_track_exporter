var loadedTracks = new Set(); // To keep track of loaded tracks
var totalTracks = 692; // Total number of expected tracks
var scrollContainer = document.querySelector(".jEMA2gVoLgPQqAFrPhFw"); // The scrollable container

function extractTracks() {
  var trackRows = document.querySelectorAll('div[data-testid="tracklist-row"]');

  trackRows.forEach((row) => {
    var titleElement = row.querySelector('div[role="gridcell"][aria-colindex="2"] a div');
    var artistElement = row.querySelector('div[role="gridcell"][aria-colindex="3"] a');

    if (titleElement && artistElement) {
      var title = titleElement.textContent.trim();
      var href = titleElement.closest("a").getAttribute("href");
      var artist = artistElement.textContent.trim();
      var trackKey = `${title}-${artist}`; // Unique key to avoid duplicates

      if (!loadedTracks.has(trackKey)) {
        loadedTracks.add(trackKey);
        console.log({ title, href, artist });
      }
    }
  });
}

function sendTracksToServer(tracks) {
  fetch("http://localhost:3000/api/tracks", {
    // Replace with your server URL
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tracks: Array.from(tracks).map((track) => {
        const [title, href, artist] = track.split("-");
        return { title, href, artist }; // Adjust href as needed
      }),
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to send tracks to server");
      }
    })
    .then((data) => {
      console.log("Tracks sent to server:", data);
    })
    .catch((error) => {
      console.error("Error sending tracks to server:", error);
    });
}

function scrollMouse() {
  if (scrollContainer) {
    // Simulate mouse wheel scroll
    var event = new WheelEvent("wheel", {
      deltaY: 100, // Adjust scroll amount
      bubbles: true,
      cancelable: true,
    });

    scrollContainer.dispatchEvent(event); // Dispatch the scroll event

    extractTracks(); // Extract tracks after scrolling

    // Check if all tracks are loaded
    if (loadedTracks.size < totalTracks) {
      setTimeout(scrollMouse, 200); // Wait for 200ms before scrolling again
    } else {
      console.log("All tracks loaded:", loadedTracks.size);
      sendTracksToServer(loadedTracks); // Send tracks to the server when finished
    }
  } else {
    console.error("Scroll container not found.");
  }
}

// Start the scrolling and extraction
scrollMouse();
