<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RelationCard
 *
 * @ORM\Table(name="relation_card", indexes={@ORM\Index(name="relation_id", columns={"relation_id"}), @ORM\Index(name="card_id", columns={"card_id"})})
 * @ORM\Entity
 */
class RelationCard
{

    const GENERAL = 1;
    const DISABLED = 0;
    const ENABLED = 1;
    const DELETED = 2;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="type", type="integer", nullable=false)
     */
    private $type;

    /**
     * @var int
     *
     * @ORM\Column(name="status", type="integer", nullable=false)
     */
    private $status;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=false)
     */
    private $updatedAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=false)
     */
    private $createdAt;

    /**
     * @var \Card
     *
     * @ORM\ManyToOne(targetEntity="Card")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="card_id", referencedColumnName="id")
     * })
     */
    private $card;

    /**
     * @var \Relation
     *
     * @ORM\ManyToOne(targetEntity="Relation")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="relation_id", referencedColumnName="id")
     * })
     */
    private $relation;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return int
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param int $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * @return int
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param int $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }

    /**
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * @param \DateTime $updatedAt
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTime $createdAt
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
    }

    /**
     * @return \Card
     */
    public function getCard()
    {
        return $this->card;
    }

    /**
     * @param \Card $card
     */
    public function setCard($card)
    {
        $this->card = $card;
    }

    /**
     * @return \Relation
     */
    public function getRelation()
    {
        return $this->relation;
    }

    /**
     * @param \Relation $relation
     */
    public function setRelation($relation)
    {
        $this->relation = $relation;
    }




}
