<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Card
 *
 * @ORM\Table(name="card", indexes={@ORM\Index(name="blockreldeck_id", columns={"blockreldeck_id"})})
 * @ORM\Entity
 */
class Card
{

    const ENABLED = 1;
    const DISABLED = 0;
    const TEXT = 1;
    const IMAGE = 2;
    const BLANK = 3;
    const OPTIONS_SINGLE = 4;
    const OPTIONS_MULTIPLE = 5;
    const USER_CARD = 6;

    // constantes excel
    const EXCEL_TEXT = 1;
    const EXCEL_CATEGORY = 2;
    const EXCEL_OPTIONS = 4;
    const EXCEL_TYPE = 3;
    const EXCEL_TYPE_TEXT = 'Text';
    const EXCEL_TYPE_IMAGE = 'Image';
    const EXCEL_TYPE_BLANK = 'Blank';
    const EXCEL_TYPE_OPTIONS_SINGLE = 'Opt. Single';
    const EXCEL_TYPE_OPTIONS_MULTIPLE = 'Opt. Multiple';

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
     * @ORM\Column(name="text", type="text", length=65535, nullable=false)
     */
    private $text;

    /**
     * @var string
     *
     * @ORM\Column(name="options", type="text", length=65535, nullable=false)
     */
    private $options;

    /**
     * @var int
     *
     * @ORM\Column(name="zIndex", type="integer", nullable=false, options={"default"="1"})
     */
    private $zindex = '1';

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
     * @var \BlockRelDeck
     *
     * @ORM\ManyToOne(targetEntity="BlockRelDeck")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="blockreldeck_id", referencedColumnName="id")
     * })
     */
    private $blockreldeck;

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
    public function getText()
    {
        return $this->text;
    }

    /**
     * @param string $text
     */
    public function setText($text)
    {
        $this->text = $text;
    }

    /**
     * @return string
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * @param string $options
     */
    public function setOptions($options)
    {
        $this->options = $options;
    }

    /**
     * @return int
     */
    public function getZindex()
    {
        return $this->zindex;
    }

    /**
     * @param int $zindex
     */
    public function setZindex($zindex)
    {
        $this->zindex = $zindex;
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
     * @return \BlockRelDeck
     */
    public function getBlockreldeck()
    {
        return $this->blockreldeck;
    }

    /**
     * @param \BlockRelDeck $blockreldeck
     */
    public function setBlockreldeck($blockreldeck)
    {
        $this->blockreldeck = $blockreldeck;
    }



}
