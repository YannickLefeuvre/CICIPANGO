package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Livre.
 */
@Entity
@Table(name = "livre")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@PrimaryKeyJoinColumn(name = "ID")
public class Livre extends Contenu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Lob
    @Column(name = "images")
    private byte[] images;

    @Column(name = "images_content_type")
    private String imagesContentType;

    @Column(name = "description")
    private String description;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Livre id(Long id) {
        this.setId(id);
        return this;
    }

    public byte[] getImages() {
        return this.images;
    }

    public Livre images(byte[] images) {
        this.setImages(images);
        return this;
    }

    public void setImages(byte[] images) {
        this.images = images;
    }

    public String getImagesContentType() {
        return this.imagesContentType;
    }

    public Livre imagesContentType(String imagesContentType) {
        this.imagesContentType = imagesContentType;
        return this;
    }

    public void setImagesContentType(String imagesContentType) {
        this.imagesContentType = imagesContentType;
    }

    public String getDescription() {
        return this.description;
    }

    public Livre description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Livre)) {
            return false;
        }
        return this.getId() != null && this.getId().equals(((Livre) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Livre{" +
            "id=" + getId() +
            ", images='" + getImages() + "'" +
            ", imagesContentType='" + getImagesContentType() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
