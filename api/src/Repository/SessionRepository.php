<?php

namespace App\Repository;

use App\Entity\Block;
use App\Entity\Session;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\ResultSetMapping;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Doctrine\RegistryInterface;

class SessionRepository extends ServiceEntityRepository
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Session::class);
    }

    public function findSessionsByText($text, $version){

        $text = ($text != "") ? $text."*" : $text;
        $versionid = $version->id;

        $conn = $this->getEntityManager()->getConnection();
        $sql = $conn->prepare("SELECT * FROM session WHERE MATCH(name) AGAINST(:name IN BOOLEAN MODE) AND version_id = :versionid ORDER BY name ASC");
        $sql->bindParam("name", $text);
        $sql->bindParam("versionid", $versionid);
        $sql->execute();
        return $sql->fetchAll();

    }


}
