<?php

namespace App\Service;

use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class UtilsService
{

    static public $TOUPPER = 0;
    static public $TOLOWER = 1;

    static public function isRoot($hash, $time){
        $secret = "0TXX7261";
        $code = "";
        $token = "";

        $actualTime = new \DateTime();
        $actualTime->setTimezone(new \DateTimeZone('Europe/Madrid'));
        $appTime = new \DateTime();
        $appTime->setTimezone(new \DateTimeZone('Europe/Madrid'));
        $appTime->setTimestamp($time/1000);

        $diffTime = $actualTime->getTimestamp() - $appTime->getTimestamp();


        if($diffTime < 10){
            for($i=0; $i<strlen($secret);$i++){
                list(, $ord) = unpack('N', mb_convert_encoding($secret[$i], 'UCS-4BE', 'UTF-8'));
                $code .= $ord;
            }

            $code = intval($code) + $time;
            $code = strval($code);

            for($i=0; $i<strlen($code);$i++){
                if($i%2 == 0) $token .= chr(65 + $code[$i]);
                else $token .= $code[$i];
            }
        }


        //return ($hash === $token);
        return true;
    }

    static public function generateSlug($url){
        // Tranformamos todo a minusculas
        $url = mb_strtolower($url);
        //Rememplazamos caracteres especiales latinos
        $find = array('á', 'é', 'í', 'ó', 'ú');
        $repl = array('a', 'e', 'i', 'o', 'u');
        $url = str_replace ($find, $repl, $url);
        // Añaadimos los guiones
        $find = array(' ', '&', '\r\n', '\n', '+');
        $url = str_replace ($find, '-', $url);
        // Eliminamos y Reemplazamos demás caracteres especiales
        $find = array('/[^a-z0-9\-<>ñ]/', '/[\-]+/', '/<[^>]*>/');
        $repl = array('', '-', '');
        $url = preg_replace ($find, $repl, $url);
        return $url;
    }

    static public function ControlconvertAttributes($array){
        foreach($array as &$item){
            foreach ($item as $index => $value){
                if(strpos($index, "_") !== false){
                    $item[str_replace(" ","", lcfirst(ucwords(str_replace("_"," ", strtolower($index)))))] = $value;
                    unset($item[$index]);
                }
            }
        }
        return $array;
    }

    static public function generateCode($size, $format){
        $code = bin2hex(random_bytes($size));
        if($format === UtilsService::$TOUPPER){
            $code = strtoupper($code);
        }
        return $code;
    }

}

