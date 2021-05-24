<?php

namespace App\Controller;

use App\Entity\BlockRelDeck;
use App\Entity\Card;
use App\Entity\Relation;
use App\Entity\RelationCard;
use App\Entity\Session;
use App\Entity\SessionRel;
use App\Entity\Version;
use App\Service\UploadService;
use App\Service\UtilsService;
use PhpOffice\PhpSpreadsheet\Calculation\DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SessionController extends AbstractController
{

    /**
     * @Route("/get/sessions/from/version", name="get_session_from_version", methods="POST")
     */
    public function getSessionsFromVersion()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $deck = null;
        $sessionList = [];
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $version = $this->getDoctrine()
                ->getRepository(Version::class)
                ->findOneBy([
                    'id' => $data->version->data->id,
                    'status' => Version::ENABLED
                ]);

            if($version != null){

                $sessions = $this->getDoctrine()
                    ->getRepository(Session::class)
                    ->findBy([
                        'version' => $version,
                        'status' => [Session::PENDING, Session::REVIEW]
                    ]);

                foreach($sessions as $session){

                    $answer = $this->getDoctrine()
                        ->getRepository(SessionRel::class)
                        ->findBy([
                            'session' => $session,
                            'status' => [SessionRel::PENDING, SessionRel::ANSWERED],
                            'type' => SessionRel::CARD
                    ]);

                    $sessionList[] = [
                        'data' => $session,
                        'answers' => $answer
                    ];

                }

                $code = 200;
                $message = "Block success";

            }else{
                $message = "The selected version does not exist.";
            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'sessions' => $sessionList,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/get/session/by/id", name="get_session_by_id", methods="POST")
     */
    public function getSessionById()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $session = null;
        $list = [];
        $relations = [];
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $session = $this->getDoctrine()
                ->getRepository(Session::class)
                ->findOneBy([
                    'id' => $data->id,
                    'status' => [Session::PENDING, Session::REVIEW]
                ]);

            if($session != null){

                $answers = $this->getDoctrine()
                    ->getRepository(SessionRel::class)
                    ->findBy([
                        'session' => $session,
                        'status' => [SessionRel::PENDING, SessionRel::ANSWERED],
                        'type' => [SessionRel::CARD, SessionRel::CARD_USER]
                    ]);

                $rels = $this->getDoctrine()
                    ->getRepository(Relation::class)
                    ->findBy([
                        'version' => $session->getVersion(),
                        'status' => Relation::ENABLED
                    ]);

                foreach($rels as $relation){

                    $relcard = $this->getDoctrine()
                        ->getRepository(RelationCard::class)
                        ->findBy([
                            'relation' => $relation,
                            'type' => RelationCard::GENERAL,
                            'status' => RelationCard::ENABLED
                        ]);

                    $relations[] = [
                        'data' => $relation,
                        'cards' => $relcard
                    ];

                }



                $code = 200;
                $message = "Block success";

            }else{
                $message = "The session does not exist.";
            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'session' => $session,
            'answers' => $answers,
            'relations' => $relations,
            'code' => $code,
            'message' => $message

        ]);
    }


    /**
     * @Route("/get/session/by/id/and/share", name="get_session_by_id_and_share", methods="POST")
     */
    public function getSessionByIdAndShare()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $session = null;
        $list = [];
        $relations = [];
        $answers = [];
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $session = $this->getDoctrine()
                ->getRepository(Session::class)
                ->findOneBy([
                    'id' => $data->id,
                    'share' => $data->share,
                    'status' => [Session::PENDING, Session::REVIEW]
                ]);

            $date = new \DateTime();
            
            if($session != null && $session->getExpiration() > $date){

                $answers = $this->getDoctrine()
                    ->getRepository(SessionRel::class)
                    ->findBy([
                        'session' => $session,
                        'status' => [SessionRel::PENDING, SessionRel::ANSWERED],
                        'type' => [SessionRel::CARD, SessionRel::CARD_USER]
                    ]);

                $rels = $this->getDoctrine()
                    ->getRepository(Relation::class)
                    ->findBy([
                        'version' => $session->getVersion(),
                        'status' => Relation::ENABLED
                    ]);

                foreach($rels as $relation){

                    $relcard = $this->getDoctrine()
                        ->getRepository(RelationCard::class)
                        ->findBy([
                            'relation' => $relation,
                            'type' => RelationCard::GENERAL,
                            'status' => RelationCard::ENABLED
                        ]);

                    $relations[] = [
                        'data' => $relation,
                        'cards' => $relcard
                    ];

                }



                $code = 200;
                $message = "Block success";

            }else{
                $message = "The session does not exist or has expired.";
            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'session' => $session,
            'answers' => $answers,
            'relations' => $relations,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/save/session", name="save_session", methods="POST")
     */
    public function saveSession()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $deck = null;
        $code = 0;
        $sessionData = null;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $version = $this->getDoctrine()
                ->getRepository(Version::class)
                ->findOneBy([
                    'id' => $data->session->version->id,
                    'status' => Version::ENABLED
                ]);

            if($version != null){

                if($data->session->name != "" && $data->session->description != ""){

                    $em = $this->getDoctrine()->getManager();

                    $session = new Session();
                    $session->setVersion($version);
                    $session->setName($data->session->name);
                    $session->setDescription($data->session->description);
                    $session->setType(Session::GENERAL);
                    $session->setStatus(Session::PENDING);
                    $session->setUpdatedAt(new \DateTime());
                    $session->setCreatedAt(new \DateTime());

                    $em->persist($session);
                    $em->flush();

                    // creamos las answer

                    $blockreldecks = $this->getDoctrine()
                        ->getRepository(BlockRelDeck::class)
                        ->findBy([
                            'block' => $version->getBlock(),
                            'version' => $version
                        ],['deck' => 'ASC']);

                    $answerList = [];

                    foreach ($blockreldecks as $rel){
                        $cards = $this->getDoctrine()
                            ->getRepository(Card::class)
                            ->findBy([
                                'blockreldeck' => $rel
                            ]);
                        foreach($cards as $card){
                            $sessionRel = new SessionRel();
                            $sessionRel->setSession($session);
                            $sessionRel->setCard($card);
                            $sessionRel->setType(SessionRel::CARD);
                            $sessionRel->setStatus(SessionRel::PENDING);
                            $sessionRel->setUpdatedAt(new \DateTime());
                            $sessionRel->setCreatedAt(new \DateTime());
                            $em->persist($sessionRel);
                            $em->flush();
                            $answerList[] = $sessionRel;
                        }
                    }

                    $sessionData = [
                        'data' => $session,
                        'answers' => $answerList
                    ];

                    $code = 200;
                    $message = "Session success";

                }else{
                    $message = "All fields are required.";
                }

            }else{
                $message = "Version not exist.";
            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'session' => $sessionData,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/update/session", name="update_session", methods="POST")
     */
    public function updateSession()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $deck = null;
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $session = $this->getDoctrine()
                ->getRepository(Session::class)
                ->findOneBy([
                    'id' => $data->session->id,
                    'status' => [Session::PENDING, Session::REVIEW]
                ]);

            if($session != null){

                if($data->session->name != "" && $data->session->description != ""){

                    $em = $this->getDoctrine()->getManager();

                    $session->setName($data->session->name);
                    $session->setDescription($data->session->description);
                    $session->setUpdatedAt(new \DateTime());

                    $em->persist($session);
                    $em->flush();

                    $code = 200;
                    $message = "Session success";

                }else{
                    $message = "All fields are required.";
                }

            }else{
                $message = "Sesion not exist.";
            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'session' => $session,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("save/session/from/user", name="save_session_from_user", methods="POST")
     */
    public function saveSessionFromUser()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $code = 0;
        $sessionData = null;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $em = $this->getDoctrine()->getManager();
            $statusTotal = Session::REVIEW;

            foreach($data->list as $item){
                foreach($item->answers as $answer){

                    $session = $this->getDoctrine()
                        ->getRepository(Session::class)
                        ->find($answer->session->id);

                    if($session != null){

                        $sessionrel = $this->getDoctrine()
                            ->getRepository(SessionRel::class)
                            ->findOneBy([
                                'id' => $answer->id,
                                'session' => $session,
                                'card' => ($answer->card != null) ? $answer->card->id : null,
                                'status' => [SessionRel::PENDING, SessionRel::ANSWERED],
                                'type' => [SessionRel::CARD, SessionRel::CARD_USER]
                            ]);

                        if($sessionrel != null){

                            // comprobamos imagen en configCard
                            if(strpos($answer->configCard->image, 'base64') !== false){
                                $path = "assets/uploads/";
                                $date = new \DateTime();
                                $upload = new UploadService();
                                $upload->uploadBase64($path . $date->format('Y/m/d/'), $answer->configCard->image, true);
                                $answer->configCard->image = $upload->getFile();
                            }

                            $sessionrel->setConfigCard(json_encode($answer->configCard));
                            $status = SessionRel::PENDING;
                            if($answer->card != null && $answer->card->type == Card::OPTIONS_SINGLE || $answer->card != null && $answer->card->type == Card::OPTIONS_MULTIPLE){
                                $sessionrel->setAnswer(json_encode($answer->answer));
                                $control = false;
                                foreach($answer->answer as $option){
                                    if($option){
                                        $control = true;
                                    }
                                }
                                if($control){
                                    $status = SessionRel::ANSWERED;
                                }else{
                                    $statusTotal = Session::PENDING;
                                }
                            }else{
                                $sessionrel->setAnswer($answer->answer);
                                if($answer->answer != ""){
                                    $status = SessionRel::ANSWERED;
                                }else{
                                    $statusTotal = Session::PENDING;
                                }
                            }
                            $sessionrel->setStatus($status);

                            $em->persist($sessionrel);
                            $em->flush();

                            // ACTUALIZAMOS STATUS SESSION
                            $session->setStatus($statusTotal);
                            $em->persist($session);
                            $em->flush();

                        }

                    }

                }
            }

            $code = 200;
            $message = "Successfully saved session.";

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'session' => $sessionData,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/get/sessions/by/text", name="get_sessions_by_text", methods="POST")
     */
    public function getSessionsByText()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $deck = null;
        $code = 0;
        $sessions = [];
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $s = $this->getDoctrine()
                ->getRepository(Session::class)
                ->findSessionsByText($data->text, $data->version);

            $s = UtilsService::ControlconvertAttributes($s);

            $code = 200;
            $message = "Block success";

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'sessions' => $s,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/update/share/url", name="create_share_url", methods="POST")
     */
    public function updateShareUrl()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $deck = null;
        $code = 0;
        $sessions = [];
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $session = $this->getDoctrine()
                ->getRepository(Session::class)
                ->findOneBy([
                    'id' => $data->session->id,
                    'status' => [Session::PENDING, Session::REVIEW]
                ]);

            if($session != null){

                $em = $this->getDoctrine()->getManager();

                $date = new \DateTime();
                $date->setTimestamp(strtotime($data->session->expiration));

                if($session->getShare() == null){
                    $code = UtilsService::generateCode(50, UtilsService::$TOLOWER);
                    $session->setShare($code);
                }

                $session->setExpiration($date);
                $em->persist($session);
                $em->flush();

            }

            $code = 200;
            $message = "Share url update";

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'session' => $session,
            'code' => $code,
            'message' => $message

        ]);
    }



}
