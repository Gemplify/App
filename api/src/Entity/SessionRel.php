<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * SessionRel
 *
 * @ORM\Table(name="session_rel", indexes={@ORM\Index(name="card_id", columns={"card_id"}), @ORM\Index(name="session_id", columns={"session_id"})})
 * @ORM\Entity
 */
class SessionRel
{

    const DISABLED = 0;
    const PENDING = 1;
    const ANSWERED = 2;
    const CARD = 1;
    const CARD_USER = 2;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="answer", type="text", length=65535, nullable=true)
     */
    private $answer;

    /**
     * @var string
     *
     * @ORM\Column(name="config_card", type="text", length=65535, nullable=true)
     */
    private $configCard;

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
     * @var \Session
     *
     * @ORM\ManyToOne(targetEntity="Session")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="session_id", referencedColumnName="id")
     * })
     */
    private $session;

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
     * @return string
     */
    public function getAnswer()
    {
        return $this->answer;
    }

    /**
     * @param string $answer
     */
    public function setAnswer($answer)
    {
        $this->answer = $answer;
    }

    /**
     * @return string
     */
    public function getConfigCard()
    {
        return $this->configCard;
    }

    /**
     * @param string $configCard
     */
    public function setConfigCard($configCard)
    {
        $this->configCard = $configCard;
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
     * @return \Session
     */
    public function getSession()
    {
        return $this->session;
    }

    /**
     * @param \Session $session
     */
    public function setSession($session)
    {
        $this->session = $session;
    }




}
