function boost_teachable() {
    let existing_elems = document.querySelectorAll(".custom_duration.cumulative"),
        playback_speed = document.querySelector(".playback-speed").textContent.trim().replace(/x$/, '');
    for (let i = 0; i < existing_elems.length; i++) {
        existing_elems[i].remove();
    }

    function addStyle() {
        let head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        head.appendChild(style);
        let css = `
        .custom_fading_highlight {
          background-color: #9ce60ab0;
          animation-name:anim_fadeout;
          animation-fill-mode:forwards;
          animation-duration:2s;
          animation-delay:2s;
        }
        @keyframes anim_fadeout {
          0% {background-color:#9ce60ab0;}
          100% { background-color:transparent;}
        }
        `
        style.appendChild(document.createTextNode(css));
    }

    addStyle()

    function prettify_seconds(duration) {
        let hrs = ~~(duration / 3600),
            mins = ~~((duration % 3600) / 60),
            secs = ~~duration % 60,
            ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    function get_hour_span(total_seconds) {
        let hour_span = document
            .createElement('span');
        hour_span.className = "custom_duration cumulative custom_fading_highlight"
        hour_span.innerText = `[${prettify_seconds(total_seconds / playback_speed)} | ${prettify_seconds(total_seconds)}]`
        return hour_span;
    }

    let course_sections = document.querySelectorAll(".course-sidebar .row.lecture-sidebar .course-section");
    for (let course_idx = 0; course_idx < course_sections.length; course_idx++) {
        let course_section = course_sections[course_idx],
            // video_durations = [],
            total_seconds = 0,
            lectures = course_section.querySelectorAll(".lecture-name");

        for (let lecture_idx = 0; lecture_idx < lectures.length; lecture_idx++) {
            let lecture = lectures[lecture_idx],
                duration = lecture.textContent.trim().match(/\((.*?)\)$/)[1],
                duration_split = duration.split(":"),
                lecture_seconds = (parseInt(duration_split[0]) * 60) + parseInt(duration_split[1]);

            // video_durations.push(duration);
            total_seconds += lecture_seconds;

            lecture.appendChild(get_hour_span(total_seconds));
        }


        course_section
            .querySelector(".section-title")
            .appendChild(get_hour_span(total_seconds));
    }

}

if (document.querySelectorAll(".course-sidebar .row.lecture-sidebar .course-section").length > 0) {
    console.log("[Boost Teachable Chrome Plugin] Found a teachable website. Powering it up 🚀")
    boost_teachable();
}