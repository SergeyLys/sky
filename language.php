
<form  id="lang" method="post" name="lang" class="lang-form">
    <select name="lang" class="lang">
        <option value="1" <?=($_SESSION['lang'] == "1"?"selected":'')?> class="option">EN</option>
        <option value="2" <?=($_SESSION['lang'] == "2"?"selected":'')?> class="option">RU</option>
        <option value="3" <?=($_SESSION['lang'] == "3"?"selected":'')?> class="option">DE</option>
        <option value="4" <?=($_SESSION['lang'] == "4"?"selected":'')?> class="option">SR</option>
        <option value="5" <?=($_SESSION['lang'] == "5"?"selected":'')?> class="option">UKR</option>
    </select>
</form>
<?php
if (isset($_POST['lang'])) {
    setcookie('lang', $_POST['lang'], 3600*24*30, "/");
    $_SESSION['lang'] = $_POST['lang'];
    exit("<meta http-equiv='refresh' content='0; url= $_SERVER[REQUEST_URI]'>");
}
?>
language.php
