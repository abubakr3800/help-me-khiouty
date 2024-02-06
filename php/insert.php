<?php
session_start();

require 'connection.php';

$name = $_POST['firstname'] . $_POST['lastname'];
$mail = $_POST['email'];
$pass = $_POST['password'];


$s = "INSERT INTO `form`(`name`, `email`, `password`) VALUES ('$name','$mail','$pass')";
$result = mysqli_query($con , $s);

// $num = mysqli_num_rows($result);
