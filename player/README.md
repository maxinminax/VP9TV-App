VP9.player
==========

VP9TV's player

- Modal:
<pre>player __ player.html5      __ htm5 video tag api (for android mobile)
          |__ player.projekktor __ projekktor video player api (for desktop version)</pre>
- Dependencies: Jquery (http://jquery.com/) [ & Projekktor (http://projekktor.com) ]
- Demo & config: index.html

<h2>Usage</h2>
<pre>var player = new VP9.player(&lt;options&gt;)</pre>

<h2>API</h2>
<h4>Events:</h4>
Usage: <pre>player.on(&lt;event&gt;, &lt;callback&gt;)</pre>
- ready
- setVideo
- play
- firstPlay
- pause
- stop
- ended
- timeupdate
- error
- seeking
- seeked

<h4>Methods:</h4>
Usage: <pre>player.&lt;method&gt;(&lt;arguments&gt;)</pre>
- setPlay
- setPause
- getCurrentVideo
- getCurrentTime
- addItem
- removeItem

<h2>LICENSE</h2>
VP9TV-PLAYER is licensed under the Mozilla Public License, Version 2.0. View the <a href="https://github.com/maxinminax/VP9.player/blob/master/LICENSE">license file</a>
