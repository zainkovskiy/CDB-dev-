$placementOptions = isset($_REQUEST['PLACEMENT_OPTIONS']) ? json_decode($_REQUEST['PLACEMENT_OPTIONS'], true) : array();
//$placementOptions['ENTITY_VALUE_ID'] = 39849;

$userId = CUser::GetID();
$userLogin = CUser::GetLogin();

if (isset($placementOptions['ENTITY_VALUE_ID'])) {
    $dealId = $placementOptions['ENTITY_VALUE_ID'];
} else {
    $dealId = 48057;
}
?>

<!doctype html>
<html lang="ru">
<head><link rel="stylesheet" href="index.34b7aba5.css">
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
    <div id="root"></div>
    <script src="index.b4b6dfad.js" defer=""></script>
</body>
</html>
