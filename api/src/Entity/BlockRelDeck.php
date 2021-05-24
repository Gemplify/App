<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * BlockRelDeck
 *
 * @ORM\Table(name="block_rel_deck", indexes={@ORM\Index(name="reld_id", columns={"deck_id"}), @ORM\Index(name="block_id", columns={"block_id"}), @ORM\Index(name="version_id", columns={"version_id"})})
 * @ORM\Entity(repositoryClass="App\Repository\BlockRelDeckRepository")
 */
class BlockRelDeck
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=false)
     */
    private $createdAt;

    /**
     * @var \Block
     *
     * @ORM\ManyToOne(targetEntity="Block")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="block_id", referencedColumnName="id")
     * })
     */
    private $block;

    /**
     * @var \Deck
     *
     * @ORM\ManyToOne(targetEntity="Deck")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="deck_id", referencedColumnName="id")
     * })
     */
    private $deck;

    /**
     * @var \Version
     *
     * @ORM\ManyToOne(targetEntity="Version")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="version_id", referencedColumnName="id")
     * })
     */
    private $version;

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
     * @return \Block
     */
    public function getBlock()
    {
        return $this->block;
    }

    /**
     * @param \Block $block
     */
    public function setBlock($block)
    {
        $this->block = $block;
    }

    /**
     * @return \Deck
     */
    public function getDeck()
    {
        return $this->deck;
    }

    /**
     * @param \Deck $deck
     */
    public function setDeck($deck)
    {
        $this->deck = $deck;
    }

    /**
     * @return \Version
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * @param \Version $version
     */
    public function setVersion($version)
    {
        $this->version = $version;
    }




}
