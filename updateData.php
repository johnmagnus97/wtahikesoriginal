<?php
$myFile = "python/hikes.txt";
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = $_POST["hikes"];
fwrite($fh, $stringData);
fclose($fh);
?>
