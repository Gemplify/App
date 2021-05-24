<?php

namespace App\Controller;

use App\Entity\Block;
use App\Entity\BlockRelDeck;
use App\Entity\Deck;
use App\Entity\Version;
use App\Service\UtilsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class VersionController extends AbstractController
{

    /**
     * @Route("/update/version", name="update_version", methods="POST")
     */
    public function updateVersion()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $version = null;
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $em = $this->getDoctrine()->getManager();

            $version = $this->getDoctrine()
                ->getRepository(Version::class)
                ->findOneBy([
                    'status' => Version::ENABLED,
                    'id' => $data->version->data->id
                ]);

            if($version != null){

                $version->setName($data->version->data->name);
                $version->setUpdatedAt(new \DateTime());

                $em->persist($version);
                $em->flush();

                $code = 200;
                $message = "Version successfully updated";

            }else{
                $message = "Version not found.";
            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'version' => $version,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/add/version", name="add_version", methods="POST")
     */
    public function addVersion()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $version = null;
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $em = $this->getDoctrine()->getManager();

            $block = $this->getDoctrine()
                ->getRepository(Block::class)
                ->findOneBy([
                    'status' => Block::ENABLED,
                    'id' => $data->block->id
                ]);

            if($block != null){
                
                $version = new Version();
                $version->setBlock($block);
                $version->setName($data->version->name);
                $version->setType(Block::GENERAL);
                $version->setStatus(Block::ENABLED);
                $version->setUpdatedAt(new \DateTime());
                $version->setCreatedAt(new \DateTime());

                $em->persist($version);
                $em->flush();

                $code = 200;
                $message = "Version successfully created";

            }else{
                $message = "Block not found.";
            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'version' => $version,
            'code' => $code,
            'message' => $message

        ]);
    }

}
