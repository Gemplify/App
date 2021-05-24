<?php

namespace App\Controller;

use App\Entity\Deck;
use App\Service\UtilsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class DeckController extends AbstractController
{
    /**
     * @Route("/get/decks", name="get_decks", methods="POST")
     */
    public function getDecks()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $deck = null;
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $deck = $this->getDoctrine()
                ->getRepository(Deck::class)
                ->findBy([],['text' => 'ASC']);

            $code = 200;
            $message = "Decks success";

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'decks' => $deck,
            'code' => $code,
            'message' => $message

        ]);
    }

}
