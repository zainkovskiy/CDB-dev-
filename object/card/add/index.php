<?php
require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/iHelper.php");

require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

CJSCore::Init(['ui','sidepanel','jquery2']);

if($USER->IsAuthorized()){
$APPLICATION->ShowHead();}
mb_internal_encoding("UTF-8");
$source = $_GET['action'];
$id = $_GET['id'];
$contact = $_GET['contact'];
$deal = $_GET['curdeal'];
$ActiveUser = CUser::GetLogin();
\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.notification");
\Bitrix\Main\UI\Extension::load("ui.buttons.icons");

?>
<!DOCTYPE html>
<html lang="ru">
<head>
<script>
    let action ='<? echo($source); ?>';
    let UID ='<? echo($id); ?>';
    let login ='<? echo($ActiveUser); ?>';
    let contact = '<? echo($contact); ?>';
    let deal = '<? echo($deal); ?>';
</script>
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta charset="UTF-8">
    <link rel="stylesheet" href="../select.css?s=<?=rand(0, 1000000)?>">
    <link rel="stylesheet" href="../main.css?s=<?=rand(0, 1000000)?>">
    <link rel="stylesheet" href="style.css?s=<?=rand(0, 1000000)?>">
    <script src="https://api-maps.yandex.ru/2.1/?apikey=9b339b12-4d97-4522-b2e5-da5a5da1c7f6&lang=ru_RU" type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <title>Create/edit</title>
</head>
<body>
   <?php echo('<div class="add container"></div>'); ?>
   <?php echo('<script src="script.js?'.chr(rand(65,90)).chr(rand(65,90)).'='.rand(0,1000000).'"></script>'); ?>
</body>
</html>