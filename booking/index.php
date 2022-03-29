<?php
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/crest.php");
CJSCore::Init();
$currentUserId = CUser::GetID();
$inputDeal = $_REQUEST['dealId'];
$typeReq = $_REQUEST['reqType'];

if($USER->IsAuthorized()){
$APPLICATION->ShowHead();}
mb_internal_encoding("UTF-8");

\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.notification");
\Bitrix\Main\UI\Extension::load("ui.buttons.icons");

if (!is_null($inputDeal))
{
  $arrResult = CRest::call('crm.deal.get', Array('id' => $inputDeal));

      if (isset($arrResult['result']['CONTACT_ID'])){
          if ((Int) $arrResult['result']['CONTACT_ID'] > 0){
              $arrClientResult = CRest::call('crm.contact.get', Array('id' => $arrResult['result']['CONTACT_ID']));
          }
      }
      unset($arrResult);

      $arrOutput = [
                    'currentUserId' => (Int) $currentUserId,
                    'dealId' => (Int) $inputDeal,
                    'reqType' => (Int) $typeReq,
                    'contact' => [
                                  'NAME' => $arrClientResult['result']['NAME'],
                                  'LAST_NAME' => $arrClientResult['result']['LAST_NAME'],
                                  'SECOND_NAME' => $arrClientResult['result']['SECOND_NAME'],
                                  'PHONE' => (String) str_replace(['+','(',')',' '],'',$arrClientResult['result']['PHONE'][0]['VALUE'])
                                 ]
                  ];
        unset($currentUserId, $inputDeal, $arrClientResult);
}

// ТУТ ВАЛЯЕТСЯ JSON С ДАННЫМИ
$strOutput = isset($arrOutput) ? json_encode($arrOutput, true) : '{"currentUserId" : '.$currentUserId.'}';

/****
  @Формат
  {
    "currentUserId" : ID Пользователя (Integer),
    "dealId" : Номер сделки (Integer),
    "reqType": Тип (0 - Уведомление, 1 - Бронь) (Integer),
    "contact" : {
                  "NAME" : "Имя",
                  "LAST_NAME" : "Фамилия",
                  "SECOND_NAME" : "Отчество",
                  "PHONE" : "Телефон"
                }

  }
*******/

?>

<!DOCTYPE html>
<html lang="rus">
<head>
<script>
    let loginID = '<? echo($currentUserId); ?>';
    let params = '<? echo($strOutput); ?>';
</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="media.css">
    <title>booking</title>
</head>
<body>
    <?php echo('<div class="booking"></div>'); ?>
    <?php echo('<script src="script.js?'.chr(rand(65,90)).chr(rand(65,90)).'='.rand(0,1000000).'"></script>'); ?>
</body>
</html>