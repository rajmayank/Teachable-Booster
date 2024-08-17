function boostTeachable() {
  // Remove existing custom duration elements
  document.querySelectorAll(".custom_duration.cumulative").forEach(el => el.remove());

  // Add CSS styles for fading highlight
  const style = document.createElement('style');
  style.textContent = `
    .custom_fading_highlight {
      background-color: #9ce60ab0;
      animation: anim_fadeout 2s forwards 2s;
    }
    @keyframes anim_fadeout {
      0% { background-color: #9ce60ab0; }
      100% { background-color: transparent; }
    }
  `;
  document.head.appendChild(style);

  // Helper function to format seconds into HH:MM:SS
  function formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = hours > 0 ? `${hours}:` : "";
    const formattedMinutes = `${minutes < 10 ? "0" : ""}${minutes}:`;
    const formattedSeconds = `${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;

    return formattedHours + formattedMinutes + formattedSeconds;
  }

  // Create a span element to display the duration
  function createDurationSpan(totalSeconds, playbackSpeed) {
    const span = document.createElement('span');
    span.className = "custom_duration cumulative custom_fading_highlight";
    span.textContent = `[${formatSeconds(totalSeconds / playbackSpeed)} | ${formatSeconds(totalSeconds)}]`;
    return span;
  }

  // Get playback speed, handle potential null value
  const playbackSpeedElement = document.querySelector(".playback-speed");
  const playbackSpeed = playbackSpeedElement ? parseFloat(playbackSpeedElement.textContent.trim().replace(/x$/, '')) : 1;

  // Iterate through course sections
  document.querySelectorAll(".course-sidebar .row.lecture-sidebar .course-section").forEach(courseSection => {
    let totalSeconds = 0;

    // Iterate through lectures within each section
    courseSection.querySelectorAll(".lecture-name").forEach(lecture => {
      const durationMatch = lecture.textContent.trim().match(/\((.*?)\)$/);
      if (!durationMatch) return;

      const duration = durationMatch[1];
      const [minutes, seconds] = duration.split(":").map(Number);
      const lectureSeconds = (minutes * 60) + seconds;

      totalSeconds += lectureSeconds;

      // Append duration span to each lecture
      lecture.appendChild(createDurationSpan(totalSeconds, playbackSpeed));
    });

    // Append total duration span to the section title
    courseSection.querySelector(".section-title").appendChild(createDurationSpan(totalSeconds, playbackSpeed));
  });
}

// Initialize the script if on a Teachable website
if (document.querySelectorAll(".course-sidebar .row.lecture-sidebar .course-section").length > 0) {
  console.log("[Boost Teachable Chrome Plugin] Found a teachable website. Powering it up 🚀");
  boostTeachable();
}
