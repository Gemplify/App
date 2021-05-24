<?php

namespace App\Service;


class EmailService
{

    public function send($config, $mailer, $assetsManager = null, $request = null){
        $message = (new \Swift_Message($config['subject']))
            ->setFrom($config['from'])
            ->setTo($config['to'])
            ->setBody(
                $config['template'],
                'text/html'
            );

        if(isset($config['attachments']) && count($config['attachments']) > 0 && $assetsManager != null && $request != null){

            foreach ($config['attachments'] as $attach){
                $path = (isset($attach->media->path)) ? $attach->media->path : $attach->getPath();
                $message->attach(\Swift_Attachment::fromPath($request->getSchemeAndHttpHost().$path));
            }

        }

        $mailer->send($message);

        return $mailer;

    }

}
