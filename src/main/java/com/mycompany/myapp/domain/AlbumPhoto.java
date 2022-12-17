package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AlbumPhoto.
 */
@Entity
@Table(name = "album_photo")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@PrimaryKeyJoinColumn(name = "ID")
public class AlbumPhoto extends Contenu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Lob
    @Column(name = "images")
    private byte[] images;

    @Column(name = "images_content_type")
    private String imagesContentType;

    @Column(name = "urls")
    private String nbPhotos;

    //    @Column(name = "ext")
    //    private String ext;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public AlbumPhoto id(Long id) {
        this.setId(id);
        return this;
    }

    public byte[] getImages() {
        return this.images;
    }

    public AlbumPhoto images(byte[] images) {
        this.setImages(images);
        return this;
    }

    public void setImages(byte[] images) {
        this.images = images;
    }

    public String getImagesContentType() {
        return this.imagesContentType;
    }

    public AlbumPhoto imagesContentType(String imagesContentType) {
        this.imagesContentType = imagesContentType;
        return this;
    }

    public void setImagesContentType(String imagesContentType) {
        this.imagesContentType = imagesContentType;
    }

    public AlbumPhoto description(String description) {
        this.setDescription(description);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    public String getNbPhotos() {
        return nbPhotos;
    }

    public void setNbPhotos(String nbPhotos) {
        this.nbPhotos = nbPhotos;
    }

    //	public String getExt() {
    //		return ext;
    //	}
    //
    //	public void setExt(String ext) {
    //		this.ext = ext;
    //	}

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AlbumPhoto)) {
            return false;
        }
        return this.getId() != null && this.getId().equals(((AlbumPhoto) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AlbumPhoto{" +
            "id=" + getId() +
            ", images='" + getImages() + "'" +
            ", imagesContentType='" + getImagesContentType() + "'" +
            ", nbPhotos='" + getNbPhotos() + "'" +
            "}";
    }
}
