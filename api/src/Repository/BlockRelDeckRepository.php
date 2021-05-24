<?php

namespace App\Repository;

use App\Entity\BlockRelDeck;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;


class BlockRelDeckRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BlockRelDeck::class);
    }


    public function getDecksByBlocks($deck){

        return $this->createQueryBuilder('b')
            ->andWhere('b.deck = :deck')
            ->groupBy('b.block')
            ->setParameter(':deck', $deck)
            ->getQuery()
            ->getResult();

    }

}
