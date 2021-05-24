<?php

namespace App\Controller;

use App\Entity\Block;
use App\Entity\BlockRelDeck;
use App\Entity\Card;
use App\Entity\Deck;
use App\Entity\Version;
use App\Service\UtilsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class BlockController extends AbstractController
{

    /**
     * @Route("/get/blocks", name="get_blocks", methods="POST")
     */
    public function getBlocks()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $deck = null;
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $blocks = $this->getDoctrine()
                ->getRepository(Block::class)
                ->findAll();

            $code = 200;
            $message = "Block success";

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'blocks' => $blocks,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/update/block", name="update_block", methods="POST")
     */
    public function updateBlock()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $block = null;
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

                $block->setText($data->block->text);
                $block->setUpdatedAt(new \DateTime());

                $em->persist($block);
                $em->flush();

                $code = 200;
                $message = "Block successfully updated";

            }else{
                $message = "Block not found.";
            }

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'version' => $block,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/get/blocks/rel", name="get_blocks_rel", methods="POST")
     */
    public function getBlocksRel()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $deck = null;
        $code = 0;
        $blocks = [];
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $bs = $this->getDoctrine()
                ->getRepository(Block::class)
                ->findBy([
                    'status' => Block::ENABLED
                ]);

            $blocks = $this->getDataBlocks($bs);

            $code = 200;
            $message = "Block success";

        }else{
            $message = "You do not have permission for this action.";
        }

        return $this->json([
            'blocks' => $blocks,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/get/blocks/by/deck", name="get_blocks_by_deck", methods="POST")
     */
    public function getBlocksByDeck()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $deck = null;
        $blocks = [];
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $deck = $this->getDoctrine()
                ->getRepository(Deck::class)
                ->find($data->deck->id);

            if($deck !== null){

                $bs = $this->getDoctrine()
                    ->getRepository(BlockRelDeck::class)
                    ->getDecksByBlocks($deck);


                $blocks = $this->getDataBlocks($bs, Block::METHOD);

            }

            $code = 200;
            $message = "Block success";

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'blocks' => $blocks,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/get/blocks/by/text", name="get_blocks_by_text", methods="POST")
     */
    public function getBlocksByText()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $deck = null;
        $code = 0;
        $blocks = [];
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $bs = $this->getDoctrine()
                ->getRepository(Block::class)
                ->findBlockByText($data->text);

            $bs = UtilsService::ControlconvertAttributes($bs);

            $blocks = $this->getDataBlocks($bs);

            $code = 200;
            $message = "Block success";

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'blocks' => $blocks,
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/save/block", name="save_block", methods="POST")
     */
    public function saveBlock()
    {

        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $version = $data->version;
        $block = $version->block;
        $decks = $data->decks;
        $decksInsert = [];
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $em = $this->getDoctrine()->getManager();

            if(isset($block) && $block->text != "" && isset($version) && $version->name != ""){

                $blockInsert = new Block();
                $blockInsert->setText($block->text);
                $blockInsert->setSlug(UtilsService::generateSlug($block->text));
                $blockInsert->setType(Block::GENERAL);
                $blockInsert->setStatus(Block::ENABLED);
                $blockInsert->setUpdatedAt(new \DateTime());
                $blockInsert->setCreatedAt(new \DateTime());

                $em->persist($blockInsert);
                $em->flush();

                $versionInsert = new Version();
                $versionInsert->setBlock($blockInsert);
                $versionInsert->setName($version->name);
                $versionInsert->setType($version->type);
                $versionInsert->setStatus($version->status);
                $versionInsert->setUpdatedAt(new \DateTime());
                $versionInsert->setCreatedAt(new \DateTime());

                $em->persist($versionInsert);
                $em->flush();

                if(count($decks) > 0){

                    foreach ($decks as $deck){

                        $deckInsert = $this->getDoctrine()
                            ->getRepository(Deck::class)
                            ->findOneBy([
                                'slug' => $deck->slug
                            ]);

                        if($deckInsert == null){

                            $deckInsert = new Deck();
                            $deckInsert->setText($deck->text);
                            $deckInsert->setSlug($deck->slug);
                            $deckInsert->setUpdatedAt(new \DateTime());
                            $deckInsert->setCreatedAt(new \DateTime());

                            $em->persist($deckInsert);
                            $em->flush();

                        }

                        $blockRelDeck = new BlockRelDeck();
                        $blockRelDeck->setBlock($blockInsert);
                        $blockRelDeck->setVersion($versionInsert);
                        $blockRelDeck->setDeck($deckInsert);
                        $blockRelDeck->setCreatedAt(new \DateTime());

                        $em->persist($blockRelDeck);
                        $em->flush();

                        $decksInsert[] = $deckInsert;

                    }

                }

                $code = 200;
                $message = "Block successfully inserted";

            }else{
                $message = "Block name and version name are required";
            }

        }else{
            $message = "You do not have permission for this action.";
        }

        return $this->json([
            'block' => [
                'data' => $blockInsert,
                'decks' => $decksInsert,
                'version' => $versionInsert
            ],
            'code' => $code,
            'message' => $message

        ]);
    }

    /**
     * @Route("/save/decks/from/block", name="save_decks_from_block", methods="POST")
     */
    public function saveDecksFromBlock()
    {

        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $decksInsert = [];
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $em = $this->getDoctrine()->getManager();

            $block = $this->getDoctrine()
                ->getRepository(Block::class)
                ->findOneBy([
                    'status' => Block::ENABLED,
                    'id' => $data->version->data->block->id
                ]);

            if($block != null){

                $version = $this->getDoctrine()
                    ->getRepository(Version::class)
                    ->findOneBy([
                        'status' => Version::ENABLED,
                        'block' => $block,
                        'id' => $data->version->data->id
                    ]);

                if($version != null){

                    foreach ($data->decks as $deck){

                        $deckInsert = $this->getDoctrine()
                            ->getRepository(Deck::class)
                            ->findOneBy([
                                'slug' => $deck->slug
                            ]);

                        if($deckInsert == null){

                            $deckInsert = new Deck();
                            $deckInsert->setText($deck->text);
                            $deckInsert->setSlug($deck->slug);
                            $deckInsert->setUpdatedAt(new \DateTime());
                            $deckInsert->setCreatedAt(new \DateTime());

                            $em->persist($deckInsert);
                            $em->flush();

                        }

                        $blockRelDeck = new BlockRelDeck();
                        $blockRelDeck->setBlock($block);
                        $blockRelDeck->setVersion($version);
                        $blockRelDeck->setDeck($deckInsert);
                        $blockRelDeck->setCreatedAt(new \DateTime());

                        $em->persist($blockRelDeck);
                        $em->flush();

                        $decksInsert[] = $deckInsert;

                    }

                    $code = 200;
                    $message = "Sections successfully inserted";

                }else {
                    $message = "Version not exist.";
                }


            }else {
                $message = "Block not exist.";
            }


        }else{
            $message = "You do not have permission for this action.";
        }

        return $this->json([
            'version' => [
                'data' => $version,
                'decks' => $decksInsert
            ],
            'code' => $code,
            'message' => $message
        ]);
    }

    /**
     * @Route("/delete/blocks", name="delete_blocks", methods="POST")
     */
    public function deleteBlocks()
    {
        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $deck = null;
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $em = $this->getDoctrine()->getManager();

            foreach($data->blocks as $b){

                $block = $this->getDoctrine()
                    ->getRepository(Block::class)
                    ->find($b->id);

                if($block !== null){

                    $em->remove($block);
                    $em->flush();

                }

            }

            $code = 200;
            $message = "Blocks successfully removed";

        }else{
            $message = "You do not have permission for this action.";
        }


        return $this->json([
            'code' => $code,
            'message' => $message

        ]);
    }

    public function getDataBlocks($bs, $type = Block::ENTITY){

        $blocks = [];

        foreach($bs as $block){

            $block = ($type == Block::ENTITY) ? $block : $block->getBlock();

            $vs = $this->getDoctrine()
                ->getRepository(Version::class)
                ->findBy([
                    'status' => Version::ENABLED,
                    'block' => $block
                ], ['createdAt' => 'DESC']);

            $versions = [];
            foreach($vs as $version){

                $rels = $this->getDoctrine()
                    ->getRepository(BlockRelDeck::class)
                    ->findBy([
                        'block' => $block,
                        'version' => $version
                    ]);

                $decks = [];
                foreach($rels as $rel){

                    $cards = $this->getDoctrine()
                        ->getRepository(Card::class)
                        ->findBy([
                            'blockreldeck' => $rel
                        ]);

                    $decks[] = [
                        'data' => $rel->getDeck(),
                        'cards' => $cards
                    ];
                }

                $versions[] = [
                    'version' => $version,
                    'decks' => $decks
                ];

            }

            $blocks[] = [
                'block' => $block,
                'versions' => $versions
            ];

        }

        return $blocks;

    }

}
