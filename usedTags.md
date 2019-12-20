# OpenStreetMap Tagging Schemes

As mapper you can contribute to Babykarte by just doing what you always do - mapping, mapping and mapping :) This documents gives you a brief overview of all tags we use so you know exactly which tags you need to add or modify to OpenStreetMap.

## Contact information
For contact information of a POI we support
- [contact:phone](https://wiki.osm.org/Key:phone) (recommended) and [phone](https://wiki.osm.org/Key:phone) for tagging telephone numbers. We do not support the subkeys.
- [contact:email](https://wiki.osm.org/Key:email) (recommended) and [email](https://wiki.osm.org/Key:email) for tagging e-mail addresses. Please do not tag e-mail addresses from POIs where you need to proove your humanity in order to view or use the e-mail address.
- [contact:website](https://wiki.osm.org/Key:website) (recommended) and [website](https://wiki.osm.org/Key:website) for tagging website addresses. Please tag them with the `https` prefix when the website supports that.
- [contact:facebook](https://wiki.osm.org/Key:facebook) (recommended) and [facebook](https://wiki.osm.org/Key:facebook) for tagging facebook profiles. Please do not link to fanpages, please do link eclusively to profile pages officially run by that POI or by someone who does it for them. You can just tag the profile username or the whole url with `https` prefix.

## Baby friendliness
This is the reason why Babykarte exists.
- [changing_table](https://wiki.osm.org/Key:changing_table) for mapping changing tables. Support for all its subkeys.
- [highchair](https://wiki.osm.org/Key:highchair) indicating, if a POI offers highchairs.
- [stroller](https://wiki.osm.org/Key:highchair) indicating, if a POI is stroller friendly. Do not confuse with the [wheelchair](https://wiki.osm.org/Key:wheelchair): `wheelchair=yes` does not necessary indicate that the POI is also stroller friendly.
- [stroller:description](https://wiki.osm.org/Key:description) to enter custom information about the stroller friendliness. Please just use that in special situations where no tag exists.
- [baby_feeding](https://wiki.openstreetmap.org/wiki/Proposed_features/babycare#Baby_feeding) indicating, if breast feeding a baby is allowed in this place (In some cultures it's not allowed without explicit permission) or indicating, if the POI helps to feed a baby.

## Opening hours
Babykarte has partially support for the famous [opening_hours](https://wiki.osm.org/Key:opening_hours) key.

## Playground (equipment) information
For information we show on playground equipment that have been tagged as seperate objects to the playground object as well on the playground object itself.
- [wheelchair](https://wiki.osm.org/Key:wheelchair) to indicate the wheelchair friendliness of that playground (equipment).
- [description](https://wiki.osm.org/Key:description) to show description. Please just use that in special situations where no tag exists.
- [max_age](https://wiki.osm.org/Key:max_age) to indicate the maximum age for a toddler or baby to be able to use that playground (equipment).
- [min_age](https://wiki.osm.org/Key:min_age) to indicate the minimum age for a toddler or baby to be able to use that playground (equipment). **Babykarte does not show playgrounds or playground equipments with `min_age` greater or equal `3`.**
- [material](https://wiki.osm.org/Key:max_age) to indicate the material the playground (equipment) has been built of. Babykarte just supports the values `wood`, `metal`, `steel`, `plastic` and `rope`. Please also use values Babykarte **does not** support because this helps someone else.
- [capacity](https://wiki.osm.org/Key:capacity) to show the number of toddlers and babies can use the playground/device at the same time.
- [capacity:disabled](https://wiki.osm.org/Key:capacity:disabled) to indicate that this playground/device can also be used by disabled toddlers and -babies.
- [baby](https://wiki.osm.org/Key:baby) to indicate, if the playground (equipment) can be used by a baby securely or not.
- [surface](https://wiki.osm.org/Key:baby) to indicate which surface the playground/device has. Babykarte supports the values `sand`, `grass`, `woodchips`, `rubbercrumb`, `tartan`, `gravel`, `paving_stones`, `wood` and `asphalt`. Please also use values Babykarte **does not** support because this helps someone else.
- [access](https://wiki.osm.org/Key:access) to indicate which group is allowed to use the playground (equipment). Babykarte supports the values `yes`, `no` and `customers`. Please also use values Babykarte **does not** support because this helps someone else. Private playgrounds/devices won't be shown by Babykarte. Please do not tag something on private property like residentials.

## Playgrounds
For information about playgrounds we support the following tagging schemes:
- [access](https://wiki.osm.org/Key:access) to indicate which group is allowed to use the playground equipment. Babykarte supports the values `yes`, `no` and `customers`. Please also use values Babykarte **does not** support because this helps someone else. Private devices won't be shown by Babykarte. Please do not tag something on private property like residentials.
- [leisure=playground](https://wiki.osm.org/Tag:leisure=playground) for tagging object as a playground.

### Mapping playground equipments on the playground itself
To map playground equipments on the object for the playground itself without creating each playground equipment as seperate object you use the [playground:](https://wiki.osm.org/Key:playground:) with the subkeys on the playground object. **Do not use this tagging for mapping each playground equipment as seperate object.**

Playground (right tagging):
    
    leisure=playground
    name=...
    ...
    playground:seesaw=yes
    ...
    
Playground (**wrong** tagging):
    
    leisure=playground
    name=...
    ...
    playground=seesaw
    ...

### Mapping playground equipments as seperate objects (recommended)
The playground itself needs to be mapped as way for this scheme to be effective. To map playground equipments as seperate object and **not** on the playground itself you use the [playground](https://wiki.osm.org/Key:playground) key and create an object for each playground equipment with it. **Do not use this tagging for mapping playground equipments on the playground object.**

Playground (**right** tagging):
    
    leisure=playground
    name=...
    ...
    
Playground equipment: seesaw (**right** tagging):
    
    playground=seesaw
    ...

Playground equipment: sandpit (**right** tagging):
    
    playground=sandpit
    ...

## Healthcare
Babykarte shows some healthcare facilities.
- [healthcare](https://wiki.osm.org/Key:healthcare) and [healthcare:speciality=paediatrics](https://wiki.osm.org/Tag:healthcare:speciality=paediatrics) for mapping children doctor offices. **The latter accepts values to be seperated by a semicolon ( _;_) in cases when more than one value applies.**
- [healthcare=midwife](https://wiki.osm.org/healthcare=midwife) for mapping midwife centres.
- [healthcare=birthing_center](https://wiki.osm.org/Tag:healthcare:speciality=paediatrics) for mapping birthing centers.

## Parks
Babykarte shows parks open to public.
- [leisure=park](https://wiki.osm.org/Tag:leisure=park) and [name](https://wiki.osm.org/Key:name) for parks with names.
- Parks tagged with [access=private](https://wiki.osm.org/Tag:leisure=park) or `min_age` greater or equal `3` won't show up. **Please tag them for someone else.**

## Shops
Babykarte shows some shops.
- [shop=baby_goods](https://wiki.osm.org/Tag:shop=baby_goods) to map shops for baby goods.
- [shop=toys](https://wiki.osm.org/Tag:shop=toys) to map shops selling toys.
- [shop=clothes](https://wiki.osm.org/Tag:shop=clothes) with [clothes=babies](https://wiki.osm.org/Key:clothes) or [clothes=children](https://wiki.osm.org/Key:clothes) to map shops selling clothes for babies or children. The [clothes](https://wiki.osm.org/Key:clothes) key supports values seperated by a semicolon ( _;_ ).

## Kindergartens or childcares
Babykarte shows kindergarten- and childcare centres
- [amenity=kindergarten](https://wiki.osm.org/Tag:amenity=kindergarten) for mapping kindergartens.
- [amenity=childcare](https://wiki.osm.org/Tag:amenity=childcare) for mapping kindergartens.

## Zoos
- [tourism=zoo](https://wiki.osm.org/Tag:tourism=zoo) for mapping Zoos.

## Places serving food and drinks
Babykarte shows some amenities serving foods and drinks. Babykarte won't show those amenities tagged with `min_age` greater or equal `3` but **please tag them for someone else.**
- [amenity=cafe](https://wiki.osm.org/Tag:amenity=cafe) for mapping cafes.
- [amenity=restaurant](https://wiki.osm.org/Tag:amenity=restaurant) for mapping restaurants.
- [amenity=fast_food](https://wiki.osm.org/Tag:amenity=fast_food) for mapping kindergartens.
