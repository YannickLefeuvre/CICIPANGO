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
public class Fichiay implements Serializable {

    /**
     *
     */

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    private static final long serialVersionUID = 5484020261535884773L;

    private String nom;

    @Lob
    private byte[] fichier;

    private String fichierContentType;

    public Fichiay() {
        super();
    }

    public Fichiay(String nom, byte[] icone, String iconeContentType) {
        super();
        this.nom = nom;
        this.fichier = icone;
        this.fichierContentType = iconeContentType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public byte[] getFichier() {
        return fichier;
    }

    public void setFichier(byte[] icone) {
        this.fichier = icone;
    }

    public String getFichierContentType() {
        return fichierContentType;
    }

    public void setFichierContentType(String iconeContentType) {
        this.fichierContentType = iconeContentType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Contenu)) {
            return false;
        }
        return id != null && id.equals(((Fichiay) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return (
            "Contenu{" +
            "id=" +
            getId() +
            ", nom='" +
            getNom() +
            "'" +
            ", fichier='" +
            getFichier() +
            "'" +
            ", fichierContentType='" +
            getFichierContentType() +
            "'" +
            "}"
        );
    }
}
