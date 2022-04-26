<?php
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/crest.php");

CJSCore::Init();
$APPLICATION->ShowHead();

$placement = $_REQUEST;
$placementOptions = isset($_REQUEST['PLACEMENT_OPTIONS']) ? json_decode($_REQUEST['PLACEMENT_OPTIONS'], true) : array();
//$placementOptions['ENTITY_VALUE_ID'] = 39849;

$userId = CUser::GetID();
$userLogin = CUser::GetLogin();
// if ($userId != 2198 && $userId != 2921)
// {
//     header("Location: https://crm.centralnoe.ru/dealincom/404.php");
// }

if (isset($placementOptions['ID'])) {
    $dealId = $placementOptions['ID'];
} else {
    $dealId = 60869;
}
?>

<!doctype html>
<html lang="ru">
<head>
  <link rel="stylesheet" href="index.e2a86d4a.css?s=<?=rand(0, 1000000)?>">
  <script src="//api.bitrix24.com/api/v1/"></script>
  <script>
      BX24.ready(async () => {
          const h = window.screen.availHeight;
          BX24.resizeWindow(window.innerWidth,  h, () => {} );
          })
  </script>
  <script>
    let deal = '<?echo($dealId);?>';
    let loginID = '<?echo($userId);?>';
    let userLogin = '<?echo($userLogin);?>';
  </script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>ДОУ</title>
</head>
<body>
  <?php echo('<div id="root"></div>'); ?>
  <?php echo('<script src="index.ff857b95.js?'.chr(rand(65,90)).chr(rand(65,90)).'='.rand(0,1000000).'"></script>'); ?>
</body>
</html>
