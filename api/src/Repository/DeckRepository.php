<?php

namespace App\Repository;

use App\Entity\Card;
use App\Entity\Deck;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Doctrine\RegistryInterface;

class DeckRepository extends ServiceEntityRepository
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Deck::class);
    }

    public function getAllCards(){

        $decks = $this->createQueryBuilder('d')
           ->innerJoin(Card::class, 'c')
            ->where('d.id = c.idDeck')
            ->orderBy('d.id', 'DESC')
            ->getQuery();


        return [
           'decks' => $decks
        ];

    }

    public function truncate(){

        $conn = $this->getEntityManager()->getConnection();

        $sql = $conn->prepare("TRUNCATE TABLE deck");
        $sql->execute();

    }

}
