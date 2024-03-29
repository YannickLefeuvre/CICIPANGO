package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Audio.
 */
@Entity
@Table(name = "audio")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@PrimaryKeyJoinColumn(name = "ID")
public class Audio extends Contenu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "url")
    private String url;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Audio id(Long id) {
        this.setId(id);
        return this;
    }

    public String getUrl() {
        return this.url;
    }

    public Audio url(String url) {
        this.setUrl(url);
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Audio)) {
            return false;
        }
        return this.getId() != null && this.getId().equals(((Audio) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Audio{" +
            "id=" + getId() +
            ", url='" + getUrl() + "'" +
            "}";
    }
}
