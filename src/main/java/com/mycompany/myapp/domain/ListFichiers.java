package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ListFichiers implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    private static final long serialVersionUID = 687991492884005033L;

    private String nomDoss;
    private String[] nomsFichiers;

    public ListFichiers() {
        super();
    }

    public ListFichiers(String nomDoss, String[] nomsFichiers) {
        super();
        this.nomDoss = nomDoss;
        this.nomsFichiers = nomsFichiers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomDoss() {
        return nomDoss;
    }

    public void setNomDoss(String nomDoss) {
        this.nomDoss = nomDoss;
    }

    public String[] getNomsFichiers() {
        return nomsFichiers;
    }

    public void setNomsFichiers(String[] nomsFichiers) {
        this.nomsFichiers = nomsFichiers;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Contenu)) {
            return false;
        }
        return id != null && id.equals(((ListFichiers) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return ("Contenu{" + "id=" + getId() + ", nomDoss='" + getNomDoss() + "'" + ", nomsFichiers='" + getNomsFichiers() + "'" + "}");
    }
}
