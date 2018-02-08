<?php

  $url = $_GET['url'];
  $headers = get_headers($url);
  $ch = curl_init();
  header($headers[10]);
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_HEADER, false);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  $res = curl_exec($ch);
  $rescode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch) ;
  echo $res;

?>
