<?php

  header("Access-Control-Allow-Origin: *");
//Function to post on Microsoft Vision API
$url = "https://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description&language=en";
$api_key ='158bce46f47447eea5ad17f2dc06a255';

$input = json_decode($_POST['input'], true);
$output = array();

for ($i=0;$i<count($input);$i++){
  $post_data = array(
     "url" => $input[$i]
  );

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS,
  json_encode($post_data)
  );
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
     'Content-Type: application/json',
     'Ocp-Apim-Subscription-Key:'.$api_key
  ));
  $image_json_string = curl_exec($ch);
  curl_close($ch);

  $image_json = json_decode($image_json_string);
  $caption = "";
  try{
    $caption = $image_json->description->captions[0]->text;
  }catch(Exception $e){
    $caption = "FAILED";
  }
  array_push($output, $caption);
}

print(json_encode($output));

?>
