<?php

namespace App\Controller;

use App\Entity\BlockRelDeck;
use App\Entity\Card;
use App\Entity\Deck;
use App\Entity\Relation;
use App\Entity\RelationCard;
use App\Entity\User;
use App\Entity\Version;
use App\Service\UploadService;
use App\Service\UtilsService;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class RelationController extends AbstractController
{

    /**
     * @Route("/get/relations/from/version", name="get_relations_from_version", methods="POST")
     */
    public function getRelationsFromVersion()
    {

        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $relations = [];
        $code = 0;
        $message = 'An error has occurred';

        if (UtilsService::isRoot($token, $time)) {

            $version = $this->getDoctrine()
                ->getRepository(Version::class)
                ->findOneBy([
                    'id' => $data->version->id,
                    'status' => Version::ENABLED,
                    'type' => Version::GENERAL
                ]);

            if($version != null){

                $rels = $this->getDoctrine()
                    ->getRepository(Relation::class)
                    ->findBy([
                        'version' => $version,
                        'status' => Relation::ENABLED
                    ]);

                foreach ($rels as $rel) {

                    $relationcards = $this->getDoctrine()
                        ->getRepository(RelationCard::class)
                        ->findBy([
                            'relation' => $rel,
                            'status' => RelationCard::ENABLED,
                            'type' => RelationCard::GENERAL
                        ]);

                    $relations[] = [
                        'data' => $rel,
                        'relationcards' => $relationcards
                    ];

                }

                $code = 200;
                $message = "Successfully obtained relations";

            }else{
                $message = "The selected version does not exist or is not active.";
            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'relations' => $relations,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/remove/relation", name="remove_relation", methods="POST")
     */
    public function removeRelation()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $relations = [];
        $code = 0;
        $message = 'An error has occurred';

        if (UtilsService::isRoot($token, $time)) {

            $relation = $this->getDoctrine()
                ->getRepository(Relation::class)
                ->findOneBy([
                    'id' => $data->relation->id,
                    'status' => Relation::ENABLED
                ]);

            if($relation != null){

                $em = $this->getDoctrine()->getManager();
                $em->remove($relation);
                $em->flush();

                $code = 200;
                $message = "Successfully removed relation";

            }else{
                $message = "The selected relation does not exist or is not active.";
            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'relations' => $relations,
            'code' => $code,
            'message' => $message

        ]);
    }

    //IGQVJXbi1aWm02amRsRmJzT1ZA6aE51azh4eDVEMERLeElMSlh6NUl4RUdCWXFGSGhxb2lrRzFvQ29UOURUaWsyenpIX1JyRXJoSnRxYTFoLXhlZAjEtSkJKdDhheWJYYncyOWFlRGtXMF9DNXZApZAmctd280OEd0WjdjeFJZA

    /**
     * @Route("/save/relation", name="save_relation", methods="POST")
     */
    public function saveRelation()
    {

        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $relation = null;
        $relationcards = [];
        $code = 0;
        $message = 'An error has occurred';

        if (UtilsService::isRoot($token, $time)) {

            $em = $this->getDoctrine()->getManager();

            if($data->relation->status == Relation::DISABLED){

                $version = $this->getDoctrine()
                    ->getRepository(Version::class)
                    ->findOneBy([
                        'id' => $data->relation->version->id,
                        'status' => Version::ENABLED,
                        'type' => Version::GENERAL
                    ]);

                if($version != null){

                    // creamos relation
                    $relation = new Relation();
                    $relation->setVersion($version);
                    $relation->setDescription($data->relation->description);
                    $relation->setName($data->relation->name);
                    $relation->setType($data->relation->type);
                    $relation->setStatus(Relation::ENABLED);
                    $relation->setUpdatedAt(new \DateTime());
                    $relation->setCreatedAt(new \DateTime());

                    $em->persist($relation);
                    $em->flush();

                    // asociamos cards
                    foreach($data->relationcards as $relationcard){

                        $card = $this->getDoctrine()
                            ->getRepository(Card::class)
                            ->findOneBy([
                                'id' => $relationcard->card->id,
                                'status' => Card::ENABLED
                            ]);

                        if($card != null){

                            $rc = new RelationCard();
                            $rc->setRelation($relation);
                            $rc->setCard($card);
                            $rc->setType(RelationCard::GENERAL);
                            $rc->setStatus(RelationCard::ENABLED);
                            $rc->setUpdatedAt(new \DateTime());
                            $rc->setCreatedAt(new \DateTime());

                            $em->persist($rc);
                            $em->flush();

                            $relationcards[] = $rc;

                        }

                    }

                    $code = 200;
                    $message = "Successfully created relation";

                }else{
                    $message = "The selected version does not exist or is not active.";
                }

            }else{

                $relation = $this->getDoctrine()
                    ->getRepository(Relation::class)
                    ->findOneBy([
                        'id' => $data->relation->id,
                        'status' => Relation::ENABLED
                    ]);

                if($relation != null){

                    // actualizamos relation
                    $relation->setDescription($data->relation->description);
                    $relation->setName($data->relation->name);
                    $relation->setUpdatedAt(new \DateTime());

                    $em->persist($relation);
                    $em->flush();

                    // asociamos y eliminamos cards
                    foreach($data->relationcards as $relationcard){

                        if($relationcard->status == RelationCard::DISABLED){

                            $card = $this->getDoctrine()
                                ->getRepository(Card::class)
                                ->findOneBy([
                                    'id' => $relationcard->card->id,
                                    'status' => Card::ENABLED
                                ]);

                            if($card != null){

                                $rc = new RelationCard();
                                $rc->setRelation($relation);
                                $rc->setCard($card);
                                $rc->setType(RelationCard::GENERAL);
                                $rc->setStatus(RelationCard::ENABLED);
                                $rc->setUpdatedAt(new \DateTime());
                                $rc->setCreatedAt(new \DateTime());

                                $em->persist($rc);
                                $em->flush();

                                $relationcards[] = $rc;

                            }

                        }else if($relationcard->status == RelationCard::DELETED){

                            $rc = $this->getDoctrine()
                                ->getRepository(RelationCard::class)
                                ->findOneBy([
                                    'id' => $relationcard->id,
                                    'status' => RelationCard::ENABLED,
                                    'type' => RelationCard::GENERAL
                                ]);

                            if($rc != null){

                                $em->remove($rc);
                                $em->flush();

                            }

                        }

                    }

                    $code = 200;
                    $message = "Successfully updated relation";


                }else{
                    $message = "The relation does not exist or is inactive";
                }

            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'data' => $relation,
            'relationcards' => $relationcards,
            'code' => $code,
            'message' => $message

        ]);
    }

}
