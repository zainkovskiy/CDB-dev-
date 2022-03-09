<?php
    require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
    $ActiveUserID = CUser::GetID();
?>
<!doctype html>
<html lang="en">
<head>
    <script>
        let loginID ='<? echo($ActiveUserID); ?>';
    </script>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="style.css?s=<?=rand(0, 1000000)?>">
    <title>leads</title>
</head>
<body>
   <?php echo('<div class="page"></div>'); ?>
   <?php echo('<script src="script.js?'.chr(rand(65,90)).chr(rand(65,90)).'='.rand(0,1000000).'"></script>'); ?>
</body>
</html>