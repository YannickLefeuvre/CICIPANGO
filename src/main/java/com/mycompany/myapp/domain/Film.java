package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Film.
 */
@Entity
@Table(name = "film")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@PrimaryKeyJoinColumn(name = "ID")
public class Film extends Contenu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "texte")
    private String texte;

    @Lob
    @Column(name = "images")
    private byte[] images;

    @Column(name = "images_content_type")
    private String imagesContentType;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Film id(Long id) {
        this.setId(id);
        return this;
    }

    public Film nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public Film isAvant(Boolean isAvant) {
        this.setIsAvant(isAvant);
        return this;
    }

    public byte[] getImages() {
        return this.images;
    }

    public Film images(byte[] images) {
        this.setImages(images);
        return this;
    }

    public void setImages(byte[] images) {
        this.images = images;
    }

    public String getImagesContentType() {
        return this.imagesContentType;
    }

    public Film imagesContentType(String imagesContentType) {
        this.imagesContentType = imagesContentType;
        return this;
    }

    public void setImagesContentType(String imagesContentType) {
        this.imagesContentType = imagesContentType;
    }

    public String getTexte() {
        return texte;
    }

    public void setTexte(String texte) {
        this.texte = texte;
    }

    public Film description(String description) {
        this.setDescription(description);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Film)) {
            return false;
        }
        return this.getId() != null && this.getId().equals(((Film) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Film{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", texte='" + getTexte() + "'" +
            ", images='" + getImages() + "'" +
            ", imagesContentType='" + getImagesContentType() + "'" +
            ", description='" + getDescription() + "'" +
            ", isavant='" + getIsAvant() + "'" +
            "}";
    }
}
