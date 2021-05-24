<?php

namespace App\Service;


use Symfony\Component\HttpFoundation\File\UploadedFile;

class UploadService
{
    private $file;

    public function uploadVideo($targetDirectory, UploadedFile $video)
    {
        $file = $targetDirectory . uniqid() . '.mp4';
        $success = move_uploaded_file($video->getPathname(), '../../'.$file);
        $this->file = $file;
    }

    public function createFolders($path){
        if(!is_dir($path)){
            mkdir($path, 0777, true);
        }
    }

    public function uploadBase64($targetDirectory, $image, $createFolder = false)
    {
        $img = explode(",", $image);
        if(count($img) > 0){
            if($createFolder){
                $this->createFolders($targetDirectory);
            }
            $img = $img[1];
            $img = str_replace(' ', '+', $img);
            $data = base64_decode($img);
            $file = $targetDirectory . uniqid() . '.jpg';
            $success = file_put_contents($file, $data);
            $this->file = $file;
        }
    }

    public function uploadUrlImage($targetDirectory, $url)
    {
        $file = $targetDirectory . uniqid() . '.jpg';
        $success = file_put_contents('../../'.$file, file_get_contents($url));
        $this->file = $file;
    }

    /**
     * @return mixed
     */
    public function getFile()
    {
        return $this->file;
    }

}

