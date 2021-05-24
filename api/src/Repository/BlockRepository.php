<?php

namespace App\Repository;

use App\Entity\Block;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\ResultSetMapping;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Doctrine\RegistryInterface;

class BlockRepository extends ServiceEntityRepository
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Block::class);
    }

    public function findBlockByText($text){

        $text = ($text != "") ? $text."*" : $text;

        $conn = $this->getEntityManager()->getConnection();
        $sql = $conn->prepare("SELECT * FROM block WHERE MATCH(text) AGAINST(:text IN BOOLEAN MODE) ORDER BY text ASC");
        $sql->bindParam("text", $text);
        $sql->execute();
        return $sql->fetchAll();

    }


}
