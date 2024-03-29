package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Contenu.
 */
@Entity
@Table(name = "contenu")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Inheritance(strategy = InheritanceType.JOINED)
public class Contenu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "icone")
    private byte[] icone;

    @Column(name = "icone_content_type")
    private String iconeContentType;

    @Column(name = "absisce")
    private Integer absisce;

    @Column(name = "ordonnee")
    private Integer ordonnee;

    @Lob
    @Column(name = "arriereplan")
    private byte[] arriereplan;

    @Column(name = "arriereplan_content_type")
    private String arriereplanContentType;

    @Column(name = "type")
    private String type;

    @Column(name = "ext")
    private String ext;

    @Column(name = "date_creation")
    private Date date_creation;

    @Column(name = "isavant")
    private Boolean isAvant;

    @ManyToOne
    @JsonIgnoreProperties(value = { "authorities" }, allowSetters = true)
    private User createur;

    @Transient
    private int nbSecret;

    @ManyToOne
    @JsonIgnoreProperties(value = { "liens", "contenus", "contenants", "lienOrigine", "lienCible", "contenant" }, allowSetters = true)
    private Contenant contenant;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Contenu id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Contenu nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public byte[] getIcone() {
        return this.icone;
    }

    public Contenu icone(byte[] icone) {
        this.setIcone(icone);
        return this;
    }

    public void setIcone(byte[] icone) {
        this.icone = icone;
    }

    public String getIconeContentType() {
        return this.iconeContentType;
    }

    public Contenu iconeContentType(String iconeContentType) {
        this.iconeContentType = iconeContentType;
        return this;
    }

    public void setIconeContentType(String iconeContentType) {
        this.iconeContentType = iconeContentType;
    }

    public Integer getAbsisce() {
        return this.absisce;
    }

    public Contenu absisce(Integer absisce) {
        this.setAbsisce(absisce);
        return this;
    }

    public void setAbsisce(Integer absisce) {
        this.absisce = absisce;
    }

    public Integer getOrdonnee() {
        return this.ordonnee;
    }

    public Contenu ordonnee(Integer ordonnee) {
        this.setOrdonnee(ordonnee);
        return this;
    }

    public void setOrdonnee(Integer ordonnee) {
        this.ordonnee = ordonnee;
    }

    public byte[] getArriereplan() {
        return this.arriereplan;
    }

    public Contenu arriereplan(byte[] arriereplan) {
        this.setArriereplan(arriereplan);
        return this;
    }

    public void setArriereplan(byte[] arriereplan) {
        this.arriereplan = arriereplan;
    }

    public String getArriereplanContentType() {
        return this.arriereplanContentType;
    }

    public Contenu arriereplanContentType(String arriereplanContentType) {
        this.arriereplanContentType = arriereplanContentType;
        return this;
    }

    public void setArriereplanContentType(String arriereplanContentType) {
        this.arriereplanContentType = arriereplanContentType;
    }

    public Contenant getContenant() {
        return this.contenant;
    }

    public void setContenant(Contenant contenant) {
        this.contenant = contenant;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public User getCreateur() {
        return createur;
    }

    public void setCreateur(User createur) {
        this.createur = createur;
    }

    public String getExt() {
        return ext;
    }

    public void setExt(String ext) {
        this.ext = ext;
    }

    public int getNbSecret() {
        return nbSecret;
    }

    public void setNbSecret(int nbSecret) {
        this.nbSecret = nbSecret;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDate_creation() {
        return date_creation;
    }

    public void setDate_creation(Date date_creation) {
        this.date_creation = date_creation;
    }

    public Boolean getIsAvant() {
        return isAvant;
    }

    public void setIsAvant(Boolean isavant) {
        this.isAvant = isavant;
    }

    public Contenu contenant(Contenant contenant) {
        this.setContenant(contenant);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Contenu)) {
            return false;
        }
        return id != null && id.equals(((Contenu) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Contenu{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", description='" + getDescription() + "'" +
            ", icone='" + getIcone() + "'" +
            ", iconeContentType='" + getIconeContentType() + "'" +
            ", absisce=" + getAbsisce() +
            ", ordonnee=" + getOrdonnee() +
            ", arriereplan='" + getArriereplan() + "'" +
            ", arriereplanContentType='" + getArriereplanContentType() + "'" +
            ", type='" + getType() + "'" +
            ", nbSecret='" + getNbSecret() + "'" +
            ", isavant='" + getIsAvant() + "'" +
            ", ext='" + getExt() + "'" +
            "}";
    }
}
