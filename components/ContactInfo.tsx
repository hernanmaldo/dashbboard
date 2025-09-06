import  { useState } from 'react';
import { Phone, MessageCircle, MapPin, Instagram, Facebook, Clock, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ContactInfo as ContactInfoType } from '../types/barbershop';

interface ContactInfoProps {
  contactInfo: ContactInfoType;
  onUpdate: (contactInfo: ContactInfoType) => void;
}

export function ContactInfo({ contactInfo, onUpdate }: ContactInfoProps) {
  const [localInfo, setLocalInfo] = useState<ContactInfoType>(contactInfo);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof ContactInfoType, value: string) => {
    setLocalInfo(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(localInfo);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalInfo(contactInfo);
    setHasChanges(false);
  };

  const socialNetworks = [
    { 
      key: 'instagram' as keyof ContactInfoType, 
      label: 'Instagram', 
      icon: Instagram, 
      placeholder: '@tu_barberia',
      prefix: '@'
    },
    { 
      key: 'facebook' as keyof ContactInfoType, 
      label: 'Facebook', 
      icon: Facebook, 
      placeholder: 'Tu Barbería',
      prefix: ''
    },
    { 
      key: 'tiktok' as keyof ContactInfoType, 
      label: 'TikTok', 
      icon: Clock, 
      placeholder: '@tu_barberia',
      prefix: '@'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Contacto</CardTitle>
        <p className="text-sm text-muted-foreground">
          Administra los datos de contacto y redes sociales de tu barbería
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información básica */}
        <div className="space-y-4">
          <h4 className="text-sm text-muted-foreground uppercase tracking-wide">Contacto Principal</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Teléfono
              </Label>
              <Input
                id="phone"
                type="tel"
                value={localInfo.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+54 9 11 1234-5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                value={localInfo.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="+54 9 11 1234-5678"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Dirección
            </Label>
            <Textarea
              id="address"
              value={localInfo.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Av. Corrientes 1234, CABA, Buenos Aires"
              rows={2}
            />
          </div>
        </div>

        {/* Redes sociales */}
        <div className="space-y-4">
          <h4 className="text-sm text-muted-foreground uppercase tracking-wide">Redes Sociales</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialNetworks.map(({ key, label, icon: Icon, placeholder, prefix }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </Label>
                <div className="relative">
                  {prefix && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {prefix}
                    </span>
                  )}
                  <Input
                    id={key}
                    value={localInfo[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    className={prefix ? 'pl-8' : ''}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previsualización */}
        <div className="space-y-4">
          <h4 className="text-sm text-muted-foreground uppercase tracking-wide">Previsualización</h4>
          
          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{localInfo.phone}</span>
                </div>
              )}
              
              {localInfo.whatsapp && (
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span>{localInfo.whatsapp}</span>
                </div>
              )}
            </div>

            {localInfo.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm">{localInfo.address}</span>
              </div>
            )}

            <div className="flex gap-4 text-sm">
              {localInfo.instagram && (
                <div className="flex items-center gap-1">
                  <Instagram className="h-3 w-3" />
                  <span>{localInfo.instagram}</span>
                </div>
              )}
              
              {localInfo.facebook && (
                <div className="flex items-center gap-1">
                  <Facebook className="h-3 w-3" />
                  <span>{localInfo.facebook}</span>
                </div>
              )}
              
              {localInfo.tiktok && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{localInfo.tiktok}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        {hasChanges && (
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar cambios
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Cancelar
            </Button>
          </div>
        )}
        
        {!hasChanges && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Save className="h-4 w-4" />
              Información guardada correctamente
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}