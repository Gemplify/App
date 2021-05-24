<?php

namespace App\Controller;

use App\Entity\BlockRelDeck;
use App\Entity\Card;
use App\Entity\Deck;
use App\Entity\Session;
use App\Entity\SessionRel;
use App\Entity\User;
use App\Entity\Version;
use App\Service\UploadService;
use App\Service\UtilsService;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CardController extends AbstractController
{
    /**
     * @Route("/get/cards", name="get_cards", methods="POST")
     */
    public function getCards()
    {

        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $decks = null;
        $code = 0;
        $message = 'Ha ocurrido un error';
        $list = [];

        if (UtilsService::isRoot($token, $time)) {


           $decks = $this->getDoctrine()
               ->getRepository(Deck::class)
               ->findAll();

           foreach($decks as $deck){
               $cards = $this->getDoctrine()
                   ->getRepository(Card::class)
                   ->findBy([
                       'status' => Card::ENABLED,
                       'type' => Card::TEXT,
                       'idDeck' => $deck->getId()
                   ]);
               $list[] = [
                   'deck' => $deck,
                   'cards' => $cards
               ];

           }


            $code = 200;
            $message = "Cards success";

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'list' => $list,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/add/card", name="add_card", methods="POST")
     */
    public function addCard()
    {

        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $sessionCard = (isset($data->session)) ? $data->session : null;
        $sessionRelCard = null;
        $sessionrel = null;
        $token = $request->get('h');
        $time = $request->get('t');
        $card = null;
        $code = 0;
        $message = 'An error has occurred';

        if (UtilsService::isRoot($token, $time)) {

            $blockreldeck = $this->getDoctrine()
                ->getRepository(BlockRelDeck::class)
                ->findOneBy([
                    'block' => $data->card->blockreldeck->block->id,
                    'version' => $data->card->blockreldeck->version->id,
                    'deck' => $data->card->blockreldeck->deck->id
                ]);

            if($blockreldeck != null || $data->card->type == Card::USER_CARD){

                if($data->card->text != "" || $data->card->type == Card::USER_CARD){

                    if($data->card->type == Card::TEXT && $data->card->options == ''){
                        $message = "Text is required";
                    }else if($data->card->type == Card::IMAGE && $data->card->options == ''){
                        $message = "Image is required";
                    }else if(($data->card->type == Card::OPTIONS_SINGLE || $data->card->type == Card::OPTIONS_MULTIPLE) && $data->card->options == ''){
                        $message = "Options is required";
                    }else if($data->card->type == Card::USER_CARD && $data->card->options == ''){
                        $message = "Text is required";
                    }else{

                        $em = $this->getDoctrine()->getManager();


                        if($data->card->type != Card::USER_CARD){

                            $card = new Card();
                            $card->setText($data->card->text);
                            $card->setBlockreldeck($blockreldeck);
                            $card->setZindex(1);
                            $card->setType($data->card->type);
                            $card->setStatus(Card::ENABLED);
                            $card->setUpdatedAt(new \DateTime());
                            $card->setCreatedAt(new \DateTime());

                            if($data->card->type == Card::IMAGE){
                                $path = "assets/uploads/";
                                $date = new \DateTime();
                                $upload = new UploadService();
                                $upload->uploadBase64($path . $date->format('Y/m/d/'), $data->card->options, true);
                                $card->setOptions($upload->getFile());
                            }else if($data->card->type == Card::OPTIONS_SINGLE || $data->card->type == Card::OPTIONS_MULTIPLE){
                                $options = json_encode(explode(',', $data->card->options));
                                $card->setOptions($options);
                            }else{
                                $card->setOptions($data->card->options);
                            }

                            $em->persist($card);
                            $em->flush();

                            // comprobamos las sesiones ya creadas para esta version
                            $sessions = $this->getDoctrine()
                                ->getRepository(Session::class)
                                ->findBy([
                                    'version' => $blockreldeck->getVersion()
                                ]);

                            foreach($sessions as $session){

                                $sessionrel = new SessionRel();
                                $sessionrel->setSession($session);
                                $sessionrel->setCard($card);
                                $sessionrel->setType(SessionRel::CARD);
                                $sessionrel->setStatus(SessionRel::PENDING);
                                $sessionrel->setUpdatedAt(new \DateTime());
                                $sessionrel->setCreatedAt(new \DateTime());

                                $em->persist($sessionrel);
                                $em->flush();

                                $session->setStatus(Session::PENDING);
                                $em->persist($session);
                                $em->flush();

                                if($sessionCard != null && $sessionCard->id == $session->getId()){
                                    $sessionRelCard = $sessionrel;
                                }

                            }

                            $code = 200;
                            $message = "Cards success";

                        }else{

                            $session = $this->getDoctrine()
                                ->getRepository(Session::class)
                                ->findOneBy([
                                    'id' => $data->session->id,
                                    'status' => [Session::PENDING, Session::REVIEW]
                                ]);

                            if($session != null){

                                $sessionrel = new SessionRel();
                                $sessionrel->setSession($session);
                                $sessionrel->setAnswer($data->card->options);
                                $sessionrel->setType(SessionRel::CARD_USER);
                                $sessionrel->setStatus(SessionRel::ANSWERED);
                                $sessionrel->setUpdatedAt(new \DateTime());
                                $sessionrel->setCreatedAt(new \DateTime());

                                $em->persist($sessionrel);
                                $em->flush();

                                $code = 200;
                                $message = "Cards success";

                            }

                        }

                    }

                }else{
                    $message = "Subject is required";
                }

            }else{
                $message = "An error has occurred";
            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'card' => $card,
            'sessionrel' => $sessionrel,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/update/card", name="save_card", methods="POST")
     */
    public function updateCard()
    {

        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $card = null;
        $code = 0;
        $message = 'An error has occurred';

        if (UtilsService::isRoot($token, $time)) {

            $blockreldeck = $this->getDoctrine()
                ->getRepository(BlockRelDeck::class)
                ->findOneBy([
                    'block' => $data->card->blockreldeck->block->id,
                    'version' => $data->card->blockreldeck->version->id,
                    'deck' => $data->card->blockreldeck->deck->id
                ]);

            if($blockreldeck != null){

                if($data->card->text != ""){

                    if($data->card->type == Card::TEXT && $data->card->options == ''){
                        $message = "Text is required";
                    }else if($data->card->type == Card::IMAGE && $data->card->options == ''){
                        $message = "Image is required";
                    }else if(($data->card->type == Card::OPTIONS_SINGLE || $data->card->type == Card::OPTIONS_MULTIPLE) && $data->card->options == ''){
                        $message = "Options is required";
                    }else{

                        $em = $this->getDoctrine()->getManager();

                        $card = $this->getDoctrine()
                            ->getRepository(Card::class)
                            ->findOneBy([
                                'id' => $data->card->id,
                                'blockreldeck' => $blockreldeck
                            ]);

                        if($card != null){

                            $card->setText($data->card->text);
                            $card->setUpdatedAt(new \DateTime());

                            if($data->card->type == Card::IMAGE && $data->card->options != $card->getOptions()){
                                $path = "assets/uploads/";
                                $date = new \DateTime();
                                $upload = new UploadService();
                                $upload->uploadBase64($path . $date->format('Y/m/d/'), $data->card->options, true);
                                $card->setOptions($upload->getFile());
                            }else if($data->card->type == Card::OPTIONS_SINGLE || $data->card->type == Card::OPTIONS_MULTIPLE){
                                $options = json_encode(explode(',', $data->card->options));
                                $card->setOptions($options);
                            }else{
                                $card->setOptions($data->card->options);
                            }

                            $em->persist($card);
                            $em->flush();

                            $code = 200;
                            $message = "Successful card update";

                        }else{
                            $message = "Card not exist";
                        }

                    }

                }else{
                    $message = "Subject is required";
                }

            }else{
                $message = "An error has occurred";
            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'card' => $card,
            'code' => $code,
            'message' => $message

        ]);
    }


    /**
     * @Route("remove/decks/and/cards", name="remove_decks_and_cards", methods="POST")
     */
    public function removeDecksAndCards()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $card = null;
        $code = 0;
        $message = 'An error has occurred';

        if (UtilsService::isRoot($token, $time)) {

            $em = $this->getDoctrine()->getManager();

            // Eliminamos BlockRelDeck seleccionados
            foreach ($data->decks as $deck){
                $blockreldeck = $this->getDoctrine()
                    ->getRepository(BlockRelDeck::class)
                    ->findOneBy([
                        'block' => $data->version->data->block->id,
                        'version' => $data->version->data->id,
                        'deck' => $deck->id
                    ]);
                if($blockreldeck != null){
                    $em->remove($blockreldeck);
                    $em->flush();
                }
            }

            // Eliminamos cards seleccionados
            foreach ($data->cards as $card){
                $card = $this->getDoctrine()
                    ->getRepository(Card::class)
                    ->find($card->id);
                if($card != null){
                    $em->remove($card);
                    $em->flush();
                }
            }

            $code = 200;
            $message = "Items successfully removed";

        }else{
            $message = "You do not have permission for this action.";
        }

        return $this->json([
            'code' => $code,
            'message' => $message

        ]);
    }


    /**
     * @Route("/admin/update-cards-excel", name="admin_update_cards_excel", methods="POST")
     */
    public function adminUpdateCardsExcel()
    {

        $request = Request::createFromGlobals();
        $version = json_decode($request->get('version'));
        $user = json_decode($request->get('user'));
        $file = $request->files->get('excel');
        $token = $request->get('h');
        $time = $request->get('t');
        $list = [];
        $code = 0;
        $message = 'Ha ocurrido un error';


        if (UtilsService::isRoot($token, $time)) {

            $em = $this->getDoctrine()->getManager();

            $user = $this->getDoctrine()
                ->getRepository(User::class)
                ->findOneBy([
                    'id' => $user->id,
                    'status' => User::ENABLED,
                    'type' => User::ADMIN
                ]);

            $version = $this->getDoctrine()
                ->getRepository(Version::class)
                ->find($version->data->id);

            if($user != null && $version != null){


                // borramos la tabla relacionada para crear nuevos
                $brds = $this->getDoctrine()
                    ->getRepository(BlockRelDeck::class)
                    ->findBy([
                        'block' => $version->getBlock(),
                        'version' => $version
                    ]);

                foreach($brds as $brd){
                    $em->remove($brd);
                }

                $em->flush();

                $reader = new Xlsx();
                $excel = $reader->load($file);
                $zindex = 0;

                for($row = 3; $row <= 200; $row++){

                    $zindex++;

                    $card = new Card();
                    $card->setStatus(Card::ENABLED);

                    $card->setUpdatedAt(new \DateTime());
                    $card->setCreatedAt(new \DateTime());
                    $card->setZindex($zindex);



                    for($col = 1; $col <= 4; $col++){

                        $cell = $excel->getActiveSheet()->getCellByColumnAndRow($col, $row);
                        $value = $cell->getValue();


                        switch ($col) {

                            case Card::EXCEL_TEXT:
                                $card->setText($value);
                                break;

                            case Card::EXCEL_CATEGORY:

                                $value = ucfirst(strtolower($value));
                                $slug = UtilsService::generateSlug($value);

                                $deck = $this->getDoctrine()
                                    ->getRepository(Deck::class)
                                    ->findOneBy([
                                        'slug' => $slug
                                    ]);

                                if(!$value) break;

                                if($deck == null){

                                    $deck = new Deck();
                                    $deck->setText($value);
                                    $deck->setSlug($slug);
                                    $deck->setUpdatedAt(new \DateTime());
                                    $deck->setCreatedAt(new \DateTime());

                                    $em->persist($deck);
                                    $em->flush();

                                }


                                $blockreldeck = $this->getDoctrine()
                                    ->getRepository(BlockRelDeck::class)
                                    ->findOneBy([
                                        'block' => $version->getBlock(),
                                        'version' => $version,
                                        'deck' => $deck
                                    ]);

                                if($blockreldeck == null){
                                    $blockreldeck = new BlockRelDeck();
                                    $blockreldeck->setDeck($deck);
                                    $blockreldeck->setBlock($version->getBlock());
                                    $blockreldeck->setVersion($version);
                                    $blockreldeck->setCreatedAt(new \DateTime());

                                    $em->persist($blockreldeck);
                                    $em->flush();
                                }


                                $card->setBlockreldeck($blockreldeck);

                                break;

                            case Card::EXCEL_TYPE:

                                $type = Card::BLANK;

                                switch ($value){

                                    case Card::EXCEL_TYPE_TEXT:
                                        $type = Card::TEXT;
                                        break;
                                    case Card::EXCEL_TYPE_IMAGE:
                                        $type = Card::IMAGE;
                                        break;
                                    case Card::EXCEL_TYPE_OPTIONS_SINGLE:
                                        $type = Card::OPTIONS_SINGLE;
                                        break;
                                    case Card::EXCEL_TYPE_OPTIONS_MULTIPLE:
                                        $type = Card::OPTIONS_MULTIPLE;
                                        break;

                                }

                                $card->setType($type);

                                break;

                            case Card::EXCEL_OPTIONS:

                                switch ($card->getType()){

                                    case Card::OPTIONS_SINGLE:
                                        $value = json_encode(explode("<>", rtrim($value)));
                                        break;
                                    case Card::OPTIONS_MULTIPLE:
                                        $value = json_encode(explode("<>", rtrim($value)));
                                        break;

                                }

                                $value = (is_null($value)) ? '' : $value;
                                $card->setOptions($value);

                                break;

                        }

                    }

                    if(!$card->getText()) break;

                    $em->persist($card);
                    $em->flush();

                    $exist = false;
                    foreach($list as $key => $item){

                       if($item['deck']->getId() == $deck->getId()){
                           $exist = true;
                           $list[$key]['cards'][] = $card;
                       }

                    }

                    if(!$exist){
                        $list[] = [
                            'deck' => $deck,
                            'cards' => [$card]
                        ];
                    }

                }

                $code = 200;
                $message = "Cards success";


            }else{
                $message = "You don not have Admin permission for this action.";
            }



        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'list' => $list,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/export/version/excel", name="export_version_excel", methods="POST")
     */
    public function exportVersionExcel()
    {

        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $version = $data->version;
        $u = $data->user;
        $token = $request->get('h');
        $time = $request->get('t');
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $em = $this->getDoctrine()->getManager();

            $user = $this->getDoctrine()
                ->getRepository(User::class)
                ->findOneBy([
                    'id' => $u->id,
                    'status' => User::ENABLED,
                    'type' => User::ADMIN
                ]);

            $version = $this->getDoctrine()
                ->getRepository(Version::class)
                ->find($version->data->id);

            if($user != null && $version != null){

                $types = ["", "Text", "Image", "Blank", "Opt. Single", "Opt. Multiple"];

                // borramos la tabla relacionada para crear nuevos
                $brds = $this->getDoctrine()
                    ->getRepository(BlockRelDeck::class)
                    ->findBy([
                        'block' => $version->getBlock(),
                        'version' => $version
                    ]);

                $excel = new Spreadsheet();
                $title = $version->getBlock()->getText() . " - " . $version->getName();
                $excel->getProperties()
                    ->setCreator("Gemplify")
                    ->setTitle($title);

                $hoja = $excel->getActiveSheet();
                $hoja->getColumnDimension("A")->setAutoSize(true);
                $hoja->getColumnDimension("B")->setAutoSize(true);
                $hoja->getColumnDimension("C")->setAutoSize(true);
                $hoja->getColumnDimension("D")->setAutoSize(true);
                $hoja->getStyle('A1:A1')->getFont()->setBold(true);
                $hoja->getStyle('A2:D2')->getFont()->setBold(true);
                $hoja->setCellValue("A1", "CARDS DATA");
                $hoja->setCellValue("A2", "Subject");
                $hoja->setCellValue("B2", "Section");
                $hoja->setCellValue("C2", "Type Card");
                $hoja->setCellValue("D2", "Options");
                $num = 3;

                foreach($brds as $brd){

                    $cards = $this->getDoctrine()
                        ->getRepository(Card::class)
                        ->findBy([
                            'status' => Card::ENABLED,
                            'blockreldeck' => $brd
                        ]);

                    foreach ($cards as $card){
                        $hoja->setCellValue("A".$num, $card->getText());
                        $hoja->setCellValue("B".$num, $brd->getDeck()->getText());
                        $hoja->setCellValue("C".$num, $types[$card->getType()]);
                        if($card->getType() == Card::OPTIONS_SINGLE || $card->getType() == Card::OPTIONS_MULTIPLE){
                            $options = "";
                            foreach (json_decode($card->getOptions()) as $option){
                                $options .= $option."<>";
                            }
                            $hoja->setCellValue("D".$num, $options);
                        }else{
                            $hoja->setCellValue("D".$num, $card->getOptions());
                        }
                        $num++;
                    }

                }

                $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($excel);
                $writer->save('assets/excels/'.$title.'.xlsx');

                $code = 200;
                $message = "Cards success";



            }else{
                $message = "You don not have Admin permission for this action.";
            }



        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'excel' => $title.'.xlsx',
            'code' => $code,
            'message' => $message

        ]);
    }

}
